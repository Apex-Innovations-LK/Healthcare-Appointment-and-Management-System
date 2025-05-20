package com.team06.appointment_service.dto;

import java.util.UUID;

public class PatientDto {

    private UUID patient_id;
    private String appointmemt_type;

    public PatientDto() {}

    public PatientDto(UUID patient_id, String appointmemt_type) {
        this.patient_id = patient_id;
        this.appointmemt_type = appointmemt_type;
    }

    public String getAppointmemt_type() {
        return appointmemt_type;
    }

    public void setAppointmemt_type(String appointmemt_type) {
        this.appointmemt_type = appointmemt_type;
    }

    public UUID getPatient_id() {
        return patient_id;
    }

    public void setPatient_id(UUID patient_id) {
        this.patient_id = patient_id;
    }


}
