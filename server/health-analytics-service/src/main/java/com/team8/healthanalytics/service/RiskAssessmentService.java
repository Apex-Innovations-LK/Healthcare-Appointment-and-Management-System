package com.team8.healthanalytics.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.team8.healthanalytics.model.PatientRecord;
import com.team8.healthanalytics.model.RiskAssessment;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Map;
import com.fasterxml.jackson.databind.JsonNode;

@Service
public class RiskAssessmentService {
    private List<PatientRecord> patientRecords = new ArrayList<>();

    @PostConstruct
    public void loadPatientData() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = getClass().getClassLoader().getResourceAsStream("patient_data.json");
            patientRecords = mapper.readValue(is, new TypeReference<List<PatientRecord>>() {});
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<RiskAssessment> getAllRiskAssessments() {
        List<RiskAssessment> results = new ArrayList<>();
        for (PatientRecord record : patientRecords) {
            results.add(assessRisk(record));
        }
        return results;
    }

    public List<PatientRecord> getAllPatientRecords() {
        return patientRecords;
    }

    public RiskAssessment assessRisk(PatientRecord record) {
        // Simple rule: if blood pressure (LBF103) >= 140/90, risk is High
        String riskLevel = "Low";
        String reason = "Normal metrics";
        for (String lbf : record.getLbfData()) {
            if (lbf.startsWith("LBF103")) {
                String[] parts = lbf.split(":");
                if (parts.length == 2 && parts[1].contains("/")) {
                    String[] bp = parts[1].split("/");
                    try {
                        int systolic = Integer.parseInt(bp[0]);
                        int diastolic = Integer.parseInt(bp[1]);
                        if (systolic >= 140 || diastolic >= 90) {
                            riskLevel = "High";
                            reason = "High blood pressure";
                        }
                    } catch (NumberFormatException ignored) {}
                }
            }
        }
        return new RiskAssessment(record.getPatientId(), riskLevel, reason);
    }

    public RiskAssessment assessRiskWithSciPy(PatientRecord record) {
        // Extract metrics for SciPy script
        double bloodGlucose = 0;
        double hemoglobin = 0;
        int systolic = 0;
        int diastolic = 0;
        for (String lbf : record.getLbfData()) {
            if (lbf.startsWith("LBF101")) {
                String[] parts = lbf.split(":");
                if (parts.length == 2) bloodGlucose = Double.parseDouble(parts[1]);
            } else if (lbf.startsWith("LBF102")) {
                String[] parts = lbf.split(":");
                if (parts.length == 2) hemoglobin = Double.parseDouble(parts[1]);
            } else if (lbf.startsWith("LBF103")) {
                String[] parts = lbf.split(":");
                if (parts.length == 2 && parts[1].contains("/")) {
                    String[] bp = parts[1].split("/");
                    try {
                        systolic = Integer.parseInt(bp[0]);
                        diastolic = Integer.parseInt(bp[1]);
                    } catch (NumberFormatException ignored) {}
                }
            }
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            String inputJson = mapper.writeValueAsString(Map.of(
                "blood_glucose", bloodGlucose,
                "hemoglobin", hemoglobin,
                "systolic", systolic,
                "diastolic", diastolic
            ));
            String scriptPath = "python/risk_assessment_scipy.py";
            ProcessBuilder pb = new ProcessBuilder("python3", scriptPath, inputJson);
            pb.redirectErrorStream(true);
            Process process = pb.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("[Python Output] " + line); // Debug print
                output.append(line);
            }
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                JsonNode result = mapper.readTree(output.toString());
                String risk = result.has("risk") ? result.get("risk").asText() : "Unknown";
                String reason = result.has("reason") ? result.get("reason").asText() : "No reason";
                return new RiskAssessment(record.getPatientId(), risk, reason);
            } else {
                return new RiskAssessment(record.getPatientId(), "Unknown", "Python script error");
            }
        } catch (Exception e) {
            return new RiskAssessment(record.getPatientId(), "Unknown", "Exception: " + e.getMessage());
        }
    }
}
