package com.team8.healthanalytics.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
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
}
