package com.team06.appointment_service.dto;

import java.security.PublicKey;
import java.util.UUID;

public class Notification1Dto {

    private UUID patient_id;

    public Notification1Dto(){}

    public Notification1Dto(UUID patient_id) {
        this.patient_id = patient_id;
    }

    public UUID getPatient_id() {
        return patient_id;
    }

    public void setPatient_id(UUID patient_id) {
        this.patient_id = patient_id;
    }



}
