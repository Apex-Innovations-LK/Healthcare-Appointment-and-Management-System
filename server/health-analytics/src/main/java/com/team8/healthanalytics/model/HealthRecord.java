package com.team8.healthanalytics.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class HealthRecord {

    @JsonProperty("record_id")     private String  recordId;
    @JsonProperty("patient_id")    private String  patientId;
    @JsonProperty("patient_name")  private String  patientName;

    @JsonProperty("patient_dob")   private String  patientDOB;
    @JsonProperty("date_of_service") private String dateOfService;

    @JsonProperty("referring_doctor") private String referringDoctor;

    @JsonProperty("chief_complaint")  private List<String> chiefComplaint;
    @JsonProperty("allergies")        private List<String> allergies;
    @JsonProperty("medications")      private List<String> medications;
    @JsonProperty("problem_list")     private List<String> problemList;
    @JsonProperty("patient_sex")      private String  patientSex;

    /* optional field – not used if absent */
    @JsonProperty("risk_score")       private Integer riskScore;
    
    // Getters and setters
    
    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getPatientDOB() {
        return patientDOB;
    }

    public void setPatientDOB(String patientDOB) {
        this.patientDOB = patientDOB;
    }

    public String getDateOfService() {
        return dateOfService;
    }

    public void setDateOfService(String dateOfService) {
        this.dateOfService = dateOfService;
    }

    public String getReferringDoctor() {
        return referringDoctor;
    }

    public void setReferringDoctor(String referringDoctor) {
        this.referringDoctor = referringDoctor;
    }

    public List<String> getChiefComplaint() {
        return chiefComplaint;
    }

    public void setChiefComplaint(List<String> chiefComplaint) {
        this.chiefComplaint = chiefComplaint;
    }

    public List<String> getAllergies() {
        return allergies;
    }

    public void setAllergies(List<String> allergies) {
        this.allergies = allergies;
    }

    public List<String> getMedications() {
        return medications;
    }

    public void setMedications(List<String> medications) {
        this.medications = medications;
    }

    public List<String> getProblemList() {
        return problemList;
    }

    public void setProblemList(List<String> problemList) {
        this.problemList = problemList;
    }

    public String getPatientSex() {
        return patientSex;
    }

    public void setPatientSex(String patientSex) {
        this.patientSex = patientSex;
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }
}
