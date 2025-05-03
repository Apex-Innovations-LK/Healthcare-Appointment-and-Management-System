package com.team8.healthanalyticsforadmin.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

/**
 *  *NO* date parsing is done here – we keep the original ISO strings that
 *  arrive from <http://localhost:3000/records>.
 *  AnalyticsService converts them when it needs to.
 */
@Data
public class HealthRecord {

    @JsonProperty("record_id")          private String  recordId;
    @JsonProperty("patient_id")         private String  patientId;
    @JsonProperty("patient_name")       private String  patientName;

    /* ISO‑8601 date strings (“yyyy‑MM‑dd” / “yyyy‑MM‑ddTHH:mm:ss…”) */
    @JsonProperty("patient_dob")        private String  patientDOB;
    @JsonProperty("date_of_service")    private String  dateOfService;

    @JsonProperty("referring_doctor")   private String  referringDoctor;
    @JsonProperty("chief_complaint")    private List<String> chiefComplaint;
    @JsonProperty("allergies")          private List<String> allergies;
    @JsonProperty("medications")        private List<String> medications;

    @JsonProperty("problem_list")       private List<String> problemList;
    @JsonProperty("patient_sex")        private String  patientSex;
}
