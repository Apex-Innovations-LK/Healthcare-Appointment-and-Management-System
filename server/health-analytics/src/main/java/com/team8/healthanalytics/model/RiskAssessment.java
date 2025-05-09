package com.team8.healthanalytics.model;

public class RiskAssessment implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
    private String patientId;
    private String riskLevel; // e.g., Low, Moderate, High
    private String riskReason; // Short explanation
    private double riskProbability; // Added field for SciPy probability output

    public RiskAssessment(String patientId, String riskLevel, String riskReason) {
        this.patientId = patientId;
        this.riskLevel = riskLevel;
        this.riskReason = riskReason;
        this.riskProbability = 0.0;
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
    
    public double getRiskProbability() {
        return riskProbability;
    }
    
    public void setRiskProbability(double riskProbability) {
        this.riskProbability = riskProbability;
    }
}
