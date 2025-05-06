package com.team06.appointment_service.model;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "appointment")
public class Appointment {

    @Id
    @Column(name = "slot_id", nullable = false)
    private UUID slotId;

    @Column(name = "session_id")
    private UUID session_id;

    @Column(name = "patient_id")
    private UUID patient_id;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "appointment_type", length = 25)
    private String appointment_type;

    @Column(name = "notes", length = 250)
    private String notes;


    public UUID getSlotId() {
        return slotId;
    }

    public void setSlotId(UUID slot_id) {
        this.slotId = slot_id;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getAppointment_type() {
        return appointment_type;
    }

    public void setAppointment_type(String appointment_type) {
        this.appointment_type = appointment_type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public UUID getPatient_id() {
        return patient_id;
    }

    public void setPatient_id(UUID patient_id) {
        this.patient_id = patient_id;
    }

    public UUID getSession_id() {
        return session_id;
    }


    public void setSession_id(UUID session_id) {
        this.session_id = session_id;
    }

//    public UUID getAppointment_id() {
//        return appointment_id;
//    }
//
//    public void setAppointment_id(UUID appointment_id) {
//        this.appointment_id = appointment_id;
//    }


    @Override
    public String toString() {
        return "Appointment{" +
                //"appointment_id=" + appointment_id +
                "slot_id=" + slotId +
                ", session_id=" + session_id +
                ", patient_id=" + patient_id +
                ", status='" + status + '\'' +
                ", appointment_type='" + appointment_type + '\'' +
                ", notes='" + notes + '\'' +
                '}';
    }

}