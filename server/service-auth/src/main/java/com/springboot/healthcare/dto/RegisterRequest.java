package com.springboot.healthcare.dto;

import java.util.Date;

public class RegisterRequest {

    private String username;
    private String first_name;
    private String last_name;
    private Date date_of_birth;
    private String gender;
    private String role;
    private String email;
    private String phone_number;
    private String password;

    // Doctor-only fields
    private String speciality;
    private String license_number;


    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirst_name() {
        return first_name;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }

    public Date getDate_of_birth() {
        return date_of_birth;
    }

    public void setDate_of_birth(Date date_of_birth) {
        this.date_of_birth = date_of_birth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone_number() {
        return phone_number;
    }

    public void setPhone_number(String phone_number) {
        this.phone_number = phone_number;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    @Override
    public String toString() {
        return "RegisterRequest [username=" + username + ", first_name=" + first_name + ", last_name=" + last_name + ", date_of_birth=" + date_of_birth + ", gender=" + gender + ", role=" + role + ", email=" + email + ", phone_number=" + phone_number + ", password=" + password + ", speciality=" + speciality + ", license_number=" + license_number + "]";
    }

}

