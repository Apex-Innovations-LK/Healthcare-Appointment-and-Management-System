package com.springboot.healthcare.dto;

import java.util.UUID;

public class DoctorDetails {
    private UUID doctor_id;
    private String first_name;
    private String last_name;
    private String speciality;
    private String license_number;

    public DoctorDetails(UUID doctor_id, String first_name, String last_name, String speciality, String license_number) {
        this.doctor_id = doctor_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.speciality = speciality;
        this.license_number = license_number;
    }


    public String getFirst_name() {
        return first_name;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public UUID getDoctor_id() {
        return doctor_id;
    }

    public void setDoctor_id(UUID doctor_id) {
        this.doctor_id = doctor_id;
    }

    public String getLast_name() {
        return last_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }

    public String getSpeciality() {
        return speciality;
    }

    public void setSpeciality(String speciality) {
        this.speciality = speciality;
    }

    public String getLicense_number() {
        return license_number;
    }

    public void setLicense_number(String license_number) {
        this.license_number = license_number;
    }



}
