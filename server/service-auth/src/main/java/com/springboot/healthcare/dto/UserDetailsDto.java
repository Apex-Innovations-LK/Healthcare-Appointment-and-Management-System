package com.springboot.healthcare.dto;

import java.util.Date;
import java.util.UUID;

public class UserDetailsDto {
    private UUID id;
    private String first_name;
    private String last_name;
    private Date date_of_birth;
    private String gender;
    private String phone_number;

    public UserDetailsDto(UUID id, String first_name, String last_name , Date date_of_birth, String gender, String phone_number) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.date_of_birth = date_of_birth;
        this.gender = gender;
        this.phone_number = phone_number;
    }

    public UserDetailsDto() { }

    public String getLast_name() {
        return last_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Date getDate_of_birth() {
        return date_of_birth;
    }

    public void setDate_of_birth(Date date_of_birth) {
        this.date_of_birth = date_of_birth;
    }

    public String getFirst_name() {
        return first_name;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPhone_number() {
        return phone_number;
    }

    public void setPhone_number(String phone_number) {
        this.phone_number = phone_number;
    }

}
