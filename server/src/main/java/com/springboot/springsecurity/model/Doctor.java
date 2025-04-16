package com.springboot.springsecurity.model;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;
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



    @Override
    public String toString() {
        return "Doctor{" +
                "id=" + id +
                ", speciality='" + speciality + '\'' +
                '}';
    }
}
