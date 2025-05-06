package com.team06.serviceschedule.model;

import jakarta.persistence.*;


import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "session_assignment")
public class SessionAssignment {


    @Id
    private UUID session_id;
    private UUID doctor_id;
    private UUID staff_id;
    @Column(name = "\"from\"")
    private Date from;
    @Column(name = "\"to\"")
    private Date to;
    private int number_of_patients;

    public UUID getSession_id() {
        return session_id;
    }

    public void setSession_id(UUID session_id) {
        this.session_id = session_id;
    }

    public UUID getDoctor_id() {
        return doctor_id;
    }

    public void setDoctor_id(UUID doctor_id) {
        this.doctor_id = doctor_id;
    }

    public UUID getStaff_id() {
        return staff_id;
    }

    public void setStaff_id(UUID staff_id) {
        this.staff_id = staff_id;
    }

    public Date getFrom() {
        return from;
    }

    public void setFrom(Date from) {
        this.from = from;
    }

    public Date getTo() {
        return to;
    }

    public void setTo(Date to) {
        this.to = to;
    }

    public int getNumber_of_patients() {
        return number_of_patients;
    }

    public void setNumber_of_patients(int number_of_patients) {
        this.number_of_patients = number_of_patients;
    }


    @Override
    public String toString() {
        return "SessionAssignment{" +
                "session_id=" + session_id +
                ", doctor_id=" + doctor_id +
                ", staff_id=" + staff_id +
                ", from=" + from +
                ", to=" + to +
                ", number_of_patients=" + number_of_patients +
                '}';
    }


}
