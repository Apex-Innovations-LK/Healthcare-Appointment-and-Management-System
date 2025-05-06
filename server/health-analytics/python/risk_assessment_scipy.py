import sys
import json

# Example: expects a JSON string as the first argument
# {"blood_glucose": 4.5, "hemoglobin": 13.2, "systolic": 120, "diastolic": 80}

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input"}))
        return
    data = json.loads(sys.argv[1])
    
    # Get the values with defaults if not present
    blood_glucose = data.get("blood_glucose", 0)
    hemoglobin = data.get("hemoglobin", 0)
    systolic = data.get("systolic", 0)
    diastolic = data.get("diastolic", 0)
    
    # Define thresholds for high risk
    # Standard medical thresholds
    high_glucose_threshold = 7.0  # fasting blood glucose in mmol/L
    low_hemoglobin_threshold = 12.0  # g/dL for women, 13.5 for men (using lower threshold)
    high_systolic_threshold = 140  # mmHg
    high_diastolic_threshold = 90   # mmHg
    
    # Determine risk and reason
    risk = "Low"
    reason = "Normal metrics"
    
    if blood_glucose > high_glucose_threshold:
        risk = "High"
        reason = "High blood glucose"
    elif hemoglobin < low_hemoglobin_threshold and hemoglobin > 0:
        risk = "High"
        reason = "Low hemoglobin"
    elif systolic >= high_systolic_threshold or diastolic >= high_diastolic_threshold:
        risk = "High"
        reason = "High blood pressure"
    elif (blood_glucose > 6.0 and blood_glucose <= high_glucose_threshold) or (systolic >= 130 and systolic < high_systolic_threshold) or (diastolic >= 85 and diastolic < high_diastolic_threshold):
        risk = "Moderate"
        reason = "Elevated health metrics"
    
    print(json.dumps({"risk": risk, "reason": reason}))

if __name__ == "__main__":
    main()