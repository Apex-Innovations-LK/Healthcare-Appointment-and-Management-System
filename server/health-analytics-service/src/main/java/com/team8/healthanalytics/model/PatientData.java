package com.team8.healthanalytics.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientData {
    private String record_id;
    private String patient_id;
    private String patient_name;
    private String patient_dob;
    private String date_of_service;
    private String referring_doctor;
    private List<String> chief_complaint;
    private List<String> allergies;
    private List<String> medications;
    private List<String> problem_list;
    private String patient_sex;
    private String address;
    private String city;
    private String state;
    private String zip;
    private String patient_phone;
    private List<String> lbf_data;
    private List<String> his_data;
}
