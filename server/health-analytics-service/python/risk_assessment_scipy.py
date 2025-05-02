import sys
import json
from scipy.stats import zscore

# Example: expects a JSON string as the first argument
# {"blood_glucose": 4.5, "hemoglobin": 13.2, "systolic": 120, "diastolic": 80}

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input"}))
        return
    data = json.loads(sys.argv[1])
    # Dummy: calculate z-score for blood_glucose and hemoglobin
    values = [data.get("blood_glucose", 0), data.get("hemoglobin", 0)]
    zs = zscore(values)
    # Dummy risk: if z-score of blood_glucose > 1, high risk
    risk = "Low"
    reason = "Normal metrics"
    if zs[0] > 1:
        risk = "High"
        reason = "High blood glucose (SciPy z-score)"
    print(json.dumps({"risk": risk, "reason": reason}))

if __name__ == "__main__":
    main()