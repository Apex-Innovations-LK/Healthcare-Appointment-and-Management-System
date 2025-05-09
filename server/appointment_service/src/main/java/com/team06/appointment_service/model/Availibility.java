package com.team06.appointment_service.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "availibility", schema = "appointmentservice")
public class Availibility {

    @Id
    @Column(name = "session_id", updatable = false, nullable = false)
    private UUID session_id;

    @Column(name = "doctor_id" ,nullable = false, updatable = false)
    private UUID doctor_id;

    @Column(name = "\"from\"")
    private Date from;

    @Column(name = "\"to\"")
    private Date to;
    private int number_of_patients;


    public Date getFrom() {
        return from;
    }

    public UUID getDoctor_id() {
        return doctor_id;
    }

    public UUID getSession_id() {
        return session_id;
    }

    public Date getTo() {
        return to;
    }

    public int getNumber_of_patients() {
        return number_of_patients;
    }


    public void setSession_id(UUID session_id) {
        this.session_id = session_id;
    }

    public void setDoctor_id(UUID doctor_id) {
        this.doctor_id = doctor_id;
    }

    public void setFrom(Date from) {
        this.from = from;
    }

    public void setTo(Date to) {
        this.to = to;
    }

    public void setNumber_of_patients(int number_of_patients) {
        this.number_of_patients = number_of_patients;
    }

    @Override
    public String toString() {
        return "Availibility{" +
                ", username='" + session_id + '\'' +
                ", role='" + doctor_id + '\'' +
                ", email='" + from + '\'' +
                ", to=" + to + '\'' +
                ", number_of_patients=" + number_of_patients + '\'' +
                '}';
    }

}
