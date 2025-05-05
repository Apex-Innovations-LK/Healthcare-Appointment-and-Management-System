package com.springboot.healthcare.model;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "doctor")
public class Doctor {

    @Id
    private UUID id;  // shared with Users.id

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")  // foreign key to Users.id
    private Users user;

    private String speciality;

    private String license_number;


    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
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
        return "Doctor{" +
                "id=" + id +
                ", speciality='" + speciality + '\'' +
                ", license_number='" + license_number + '\'' +
                '}';
    }
}
