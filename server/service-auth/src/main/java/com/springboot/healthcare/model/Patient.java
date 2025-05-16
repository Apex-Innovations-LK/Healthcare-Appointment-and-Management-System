package com.springboot.healthcare.model;

import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "patient", schema = "authservice")
public class Patient {

    @Id
    private UUID id;  // shared with Users.id

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")  // foreign key to Users.id
    private Users user;

    @ElementCollection
    @CollectionTable(
            name = "patient_medical_history",
            joinColumns = @JoinColumn(name = "patient_id")
    )
    @Column(name = "record")
    private List<String> medicalHistory;

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

    public List<String> getMedicalHistory() {
        return medicalHistory;
    }

    public void setMedicalHistory(List<String> medicalHistory) {
        this.medicalHistory = medicalHistory;
    }

    @Override
    public String toString() {
        return "Patient{" +
                "id=" + id +
                ", medicalHistory=" + medicalHistory +
                '}';
    }
}
