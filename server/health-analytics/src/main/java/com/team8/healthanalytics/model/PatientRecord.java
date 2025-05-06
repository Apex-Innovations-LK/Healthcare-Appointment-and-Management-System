package com.team8.healthanalytics.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class PatientRecord {
    @JsonProperty("record_id")
    private String recordId;
    @JsonProperty("patient_id")
    private String patientId;
    @JsonProperty("patient_name")
    private String patientName;
    @JsonProperty("patient_dob")
    private String patientDob;
    @JsonProperty("date_of_service")
    private String dateOfService;
    @JsonProperty("referring_doctor")
    private String referringDoctor;
    @JsonProperty("chief_complaint")
    private List<String> chiefComplaint;
    @JsonProperty("allergies")
    private List<String> allergies;
    @JsonProperty("medications")
    private List<String> medications;
    @JsonProperty("problem_list")
    private List<String> problemList;
    @JsonProperty("patient_sex")
    private String patientSex;
    @JsonProperty("address")
    private String address;
    @JsonProperty("city")
    private String city;
    @JsonProperty("state")
    private String state;
    @JsonProperty("zip")
    private String zip;
    @JsonProperty("patient_phone")
    private String patientPhone;
    @JsonProperty("lbf_data")
    private List<String> lbfData;
    @JsonProperty("his_data")
    private List<String> hisData;

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

    public String getPatientDob() {
        return patientDob;
    }

    public void setPatientDob(String patientDob) {
        this.patientDob = patientDob;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public String getPatientPhone() {
        return patientPhone;
    }

    public void setPatientPhone(String patientPhone) {
        this.patientPhone = patientPhone;
    }

    public List<String> getLbfData() {
        return lbfData;
    }

    public void setLbfData(List<String> lbfData) {
        this.lbfData = lbfData;
    }

    public List<String> getHisData() {
        return hisData;
    }

    public void setHisData(List<String> hisData) {
        this.hisData = hisData;
    }
}