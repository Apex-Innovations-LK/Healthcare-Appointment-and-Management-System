import sys
import json
import numpy as np
from scipy import stats
from scipy.spatial.distance import euclidean

# Health condition pools
PROBLEM_LIST_POOL = [
    "Hypertension", "Diabetes", "Asthma", "Migraines", "Arthritis",
    "Cholesterol", "Anxiety", "Depression", "Obesity", "Back Pain", "Other"
]

MEDICATIONS_POOL = [
    "Paracetamol", "Amoxicillin", "Metformin", "Ibuprofen", "Atorvastatin",
    "Omeprazole", "Amlodipine", "Lisinopril", "Albuterol", "Prednisone", "Other"
]

ALLERGIES_POOL = [
    "Penicillin", "Pollen", "Dust", "Nuts", "Shellfish",
    "Ibuprofen", "Latex", "Milk", "Eggs", "Soy", "Other"
]

# Risk factor weightings for conditions
HIGH_RISK_CONDITIONS = {"Hypertension", "Diabetes", "Cholesterol", "Obesity", "Asthma"}
MODERATE_RISK_CONDITIONS = {"Migraines", "Arthritis", "Anxiety", "Depression", "Back Pain"}

# Risk factor weightings for medications
HIGH_RISK_MEDICATIONS = {"Metformin", "Atorvastatin", "Lisinopril", "Amlodipine", "Prednisone"}
MODERATE_RISK_MEDICATIONS = {"Albuterol", "Omeprazole"}

# Constants for reference values - defined only once
HEALTHY_CENTROID = np.array([5.0, 14.0, 120, 80])  # Normal values
MODERATE_CENTROID = np.array([6.5, 11.5, 135, 87])  # Moderate risk values
HIGH_RISK_CENTROID = np.array([8.0, 10.0, 150, 95])  # High risk values

# Reference population statistics (mean and std dev)
REFERENCE_MEANS = np.array([5.2, 14.0, 120, 80])  # [glucose, hemoglobin, systolic, diastolic]
REFERENCE_STDS = np.array([0.8, 1.5, 10, 8])      # [glucose, hemoglobin, systolic, diastolic]

def calculate_health_factors_risk(problems=None, medications=None, allergies=None):
    """Calculate additional risk based on health factors."""
    problems = problems or []
    medications = medications or []
    allergies = allergies or []
    
    risk_score = 0.0
    risk_reasons = []
    
    # Assess problem list
    high_risk_problems = [p for p in problems if p in HIGH_RISK_CONDITIONS]
    moderate_risk_problems = [p for p in problems if p in MODERATE_RISK_CONDITIONS]
    
    if high_risk_problems:
        risk_score += 0.2 * len(high_risk_problems)
        risk_reasons.append(f"High-risk condition(s): {', '.join(high_risk_problems)}")
    
    if moderate_risk_problems:
        risk_score += 0.1 * len(moderate_risk_problems)
        if not risk_reasons:  # Only add if no high risk problems
            risk_reasons.append(f"Moderate-risk condition(s): {', '.join(moderate_risk_problems)}")
    
    # Assess medications
    high_risk_meds = [m for m in medications if m in HIGH_RISK_MEDICATIONS]
    moderate_risk_meds = [m for m in medications if m in MODERATE_RISK_MEDICATIONS]
    
    if high_risk_meds:
        risk_score += 0.1 * len(high_risk_meds)
        if not risk_reasons:  # Only add if no problems mentioned
            risk_reasons.append(f"Taking medication(s) for serious conditions")
    
    if moderate_risk_meds and not high_risk_meds and not risk_reasons:
        risk_score += 0.05 * len(moderate_risk_meds)
    
    # Assess medication-allergy interactions
    med_allergy_interaction = any(med in allergies for med in medications)
    if med_allergy_interaction:
        risk_score += 0.2
        risk_reasons.append("Potential medication-allergy interaction")
    
    return risk_score, risk_reasons

def calculate_risk(patient_features, problems=None, medications=None, allergies=None):
    """Calculate risk level and reason based on patient features and health factors."""
    # Calculate distances to each centroid efficiently
    distances = np.array([
        euclidean(patient_features, HEALTHY_CENTROID),
        euclidean(patient_features, MODERATE_CENTROID),
        euclidean(patient_features, HIGH_RISK_CENTROID)
    ])
    closest_centroid = np.argmin(distances)
    
    # Map closest centroid to risk level and reason
    risk_mapping = [
        ("Low", "Metrics close to healthy reference values"),
        ("Moderate", "Metrics indicate moderate health concerns"),
        ("High", "Metrics strongly indicate high health risk")
    ]
    
    risk, reason = risk_mapping[closest_centroid]
    
    # Calculate z-scores efficiently with vectorization
    z_scores = np.zeros(4)
    mask = REFERENCE_STDS > 0
    z_scores[mask] = (patient_features[mask] - REFERENCE_MEANS[mask]) / REFERENCE_STDS[mask]
    
    # Specialized override rules for extreme values
    glucose_z, hemoglobin_z, systolic_z, diastolic_z = z_scores
    
    # Only apply rules if we have valid data (non-zero values)
    if patient_features[0] > 0 and glucose_z > 2.5:
        risk = "High"
        reason = "Significantly elevated blood glucose"
    elif patient_features[1] > 0 and hemoglobin_z < -2.0:
        risk = "High"
        reason = "Significantly low hemoglobin"
    elif systolic_z > 2.0 or diastolic_z > 2.0:
        risk = "High"
        reason = "Significantly elevated blood pressure"
    
    # Calculate probability (optimized calculation)
    combined_z = (glucose_z + abs(hemoglobin_z) + systolic_z + diastolic_z) / 4
    base_probability = 1 / (1 + np.exp(-combined_z))
    
    # Factor in health conditions, medications, and allergies
    health_risk_score, health_reasons = calculate_health_factors_risk(problems, medications, allergies)
    
    # Adjust probability based on health factors (max 0.9 to avoid certainty)
    adjusted_probability = min(0.9, base_probability + health_risk_score)
    
    # Adjust risk level based on health factors
    if health_risk_score >= 0.25 and risk == "Low":
        risk = "Moderate"
        reason = health_reasons[0] if health_reasons else "Multiple health factors indicate increased risk"
    elif health_risk_score >= 0.35 and risk == "Moderate":
        risk = "High"
        reason = health_reasons[0] if health_reasons else "Multiple health factors indicate high risk"
    elif health_risk_score >= 0.2 and risk == "High":
        # Already high risk, keep it high but update reason if appropriate
        if health_reasons:
            reason += f" and {health_reasons[0].lower()}"
    
    return risk, reason, adjusted_probability

def batch_calculate_risks(patients_data):
    """Process multiple patient records in a single batch."""
    results = []
    
    for data in patients_data:
        # Create feature vector for the patient
        patient_features = np.array([
            data.get("blood_glucose", 0),
            data.get("hemoglobin", 0),
            data.get("systolic", 0),
            data.get("diastolic", 0)
        ])
        
        # Get health factors
        problems = data.get("problems", [])
        medications = data.get("medications", [])
        allergies = data.get("allergies", [])
        
        # Calculate risk
        risk, reason, probability = calculate_risk(
            patient_features, 
            problems=problems,
            medications=medications,
            allergies=allergies
        )
        
        # Add to results
        results.append({
            "id": data.get("id", "unknown"),
            "risk": risk, 
            "reason": reason,
            "risk_probability": round(float(probability), 2)
        })
    
    return results

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input"}))
        return
    
    try:
        # Parse input data - check if it's a single record or batch
        data = json.loads(sys.argv[1])
        
        # Determine if input is a batch (list) or single record (dict)
        if isinstance(data, list):
            # Process batch of records
            results = batch_calculate_risks(data)
            print(json.dumps(results))
        else:
            # Process single record for backward compatibility
            patient_features = np.array([
                data.get("blood_glucose", 0),
                data.get("hemoglobin", 0),
                data.get("systolic", 0),
                data.get("diastolic", 0)
            ])
            
            # Get health factors
            problems = data.get("problems", [])
            medications = data.get("medications", [])
            allergies = data.get("allergies", [])
            
            # Calculate risk
            risk, reason, probability = calculate_risk(
                patient_features,
                problems=problems,
                medications=medications,
                allergies=allergies
            )
            
            # Format output
            print(json.dumps({
                "risk": risk, 
                "reason": reason,
                "risk_probability": round(float(probability), 2)
            }))
    
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()