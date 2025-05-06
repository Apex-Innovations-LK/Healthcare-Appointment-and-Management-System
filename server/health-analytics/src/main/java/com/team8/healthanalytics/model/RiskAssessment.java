package com.team8.healthanalytics.model;

public class RiskAssessment {
    private String patientId;
    private String riskLevel; // e.g., Low, Moderate, High
    private String riskReason; // Short explanation

    public RiskAssessment(String patientId, String riskLevel, String riskReason) {
        this.patientId = patientId;
        this.riskLevel = riskLevel;
        this.riskReason = riskReason;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getRiskReason() {
        return riskReason;
    }

    public void setRiskReason(String riskReason) {
        this.riskReason = riskReason;
    }
}
