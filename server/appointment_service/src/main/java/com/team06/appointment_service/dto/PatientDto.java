package com.team06.appointment_service.dto;

public class PatientDto {

    private String patient_id;
    private String appointmemt_type;

    public PatientDto() {}

    public PatientDto(String patient_id, String appointmemt_type) {
        this.patient_id = patient_id;
        this.appointmemt_type = appointmemt_type;
    }

    public String getAppointmemt_type() {
        return appointmemt_type;
    }

    public void setAppointmemt_type(String appointmemt_type) {
        this.appointmemt_type = appointmemt_type;
    }

    public String getPatient_id() {
        return patient_id;
    }

    public void setPatient_id(String patient_id) {
        this.patient_id = patient_id;
    }


}
