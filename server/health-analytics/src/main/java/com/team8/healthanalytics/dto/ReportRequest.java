package com.team8.healthanalytics.dto;

import jakarta.validation.constraints.Pattern; // Updated import
import java.util.List;

public class ReportRequest {

    private String reportType; // e.g., "patient_visits", "diagnosis_summary", "demographic_summary"

    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "startDate must be in YYYY-MM-DD format")
    private String startDate; // Format: YYYY-MM-DD

    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "endDate must be in YYYY-MM-DD format")
    private String endDate;

    private String patientType; // Matches problem_list, e.g., "Hypertension"
    private String patientSex; // e.g., "Male", "Female"
    private String ageRange; // e.g., "0-30", "30-60", "60+"
    private String city; // e.g., "Colombo"
    private String state; // e.g., "Western"
    private List<String> allergies; // e.g., ["Penicillin", "Ibuprofen"]
    private List<String> medications; // e.g., ["Paracetamol", "Aspirin"]

    // Getters and Setters
    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
    public String getPatientType() { return patientType; }
    public void setPatientType(String patientType) { this.patientType = patientType; }
    public String getPatientSex() { return patientSex; }
    public void setPatientSex(String patientSex) { this.patientSex = patientSex; }
    public String getAgeRange() { return ageRange; }
    public void setAgeRange(String ageRange) { this.ageRange = ageRange; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public List<String> getAllergies() { return allergies; }
    public void setAllergies(List<String> allergies) { this.allergies = allergies; }
    public List<String> getMedications() { return medications; }
    public void setMedications(List<String> medications) { this.medications = medications; }
}