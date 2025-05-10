package com.team07.ipfs_service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
public class HealthRecord {

    @JsonProperty("record_id")
    private String recordId;

    @JsonProperty("patient_id")
    private String patientId;

    @JsonProperty("patient_name")
    private String patientName;

    @JsonProperty("patient_dob")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date patientDOB;

    @JsonProperty("date_of_service")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    private Date dateOfService; // Timestamp of the record creation

    @JsonProperty("referring_doctor")
    private String referringDoctor; // DoctorID

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
    private List<String> lbfData;     // For LBFxxx:fieldid data , Lab Results


    @JsonProperty("his_data")
    private List<String> hisData;     // Doctor should be able to access patient's history data and add it to the record as health record ids

    // Builder class
    public static class Builder {
        private String recordId;
        private String patientId;
        private String patientName;
        private Date patientDOB;
        private Date dateOfService;
        private String referringDoctor;
        private List<String> chiefComplaint;
        private List<String> allergies;
        private List<String> medications;
        private List<String> problemList;
        private String patientSex;
        private String address;
        private String city;
        private String state;
        private String zip;
        private String patientPhone;
        private List<String> lbfData;
        private List<String> hisData;

        public Builder recordId(String recordId) {
            this.recordId = recordId;
            return this;
        }

        public Builder patientId(String patientId) {
            this.patientId = patientId;
            return this;
        }

        public Builder patientName(String patientName) {
            this.patientName = patientName;
            return this;
        }

        public Builder patientDOB(Date patientDOB) {
            this.patientDOB = patientDOB;
            return this;
        }

        public Builder dateOfService(Date dateOfService) {
            this.dateOfService = dateOfService;
            return this;
        }

        public Builder referringDoctor(String referringDoctor) {
            this.referringDoctor = referringDoctor;
            return this;
        }

        public Builder chiefComplaint(List<String> chiefComplaint) {
            this.chiefComplaint = chiefComplaint;
            return this;
        }

        public Builder allergies(List<String> allergies) {
            this.allergies = allergies;
            return this;
        }

        public Builder medications(List<String> medications) {
            this.medications = medications;
            return this;
        }

        public Builder problemList(List<String> problemList) {
            this.problemList = problemList;
            return this;
        }

        public Builder patientSex(String patientSex) {
            this.patientSex = patientSex;
            return this;
        }

        public Builder address(String address) {
            this.address = address;
            return this;
        }

        public Builder city(String city) {
            this.city = city;
            return this;
        }

        public Builder state(String state) {
            this.state = state;
            return this;
        }

        public Builder zip(String zip) {
            this.zip = zip;
            return this;
        }

        public Builder patientPhone(String patientPhone) {
            this.patientPhone = patientPhone;
            return this;
        }

        public Builder lbfData(List<String> lbfData) {
            this.lbfData = lbfData;
            return this;
        }

        public Builder hisData(List<String> hisData) {
            this.hisData = hisData;
            return this;
        }


        public HealthRecord build() {
            HealthRecord healthRecord = new HealthRecord();
            healthRecord.recordId = this.recordId;
            healthRecord.patientId = this.patientId;
            healthRecord.patientName = this.patientName;
            healthRecord.patientDOB = this.patientDOB;
            healthRecord.dateOfService = this.dateOfService;
            healthRecord.referringDoctor = this.referringDoctor;
            healthRecord.chiefComplaint = this.chiefComplaint;
            healthRecord.allergies = this.allergies;
            healthRecord.medications = this.medications;
            healthRecord.problemList = this.problemList;
            healthRecord.patientSex = this.patientSex;
            healthRecord.address = this.address;
            healthRecord.city = this.city;
            healthRecord.state = this.state;
            healthRecord.zip = this.zip;
            healthRecord.patientPhone = this.patientPhone;
            healthRecord.lbfData = this.lbfData;
            healthRecord.hisData = this.hisData;
            return healthRecord;
        }
    }

    // Static method to get a new Builder instance
    public static Builder builder() {
        return new Builder();
    }

}
