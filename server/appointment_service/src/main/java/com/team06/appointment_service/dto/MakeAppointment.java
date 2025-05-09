package com.team06.appointment_service.dto;

import java.util.UUID;

public class MakeAppointment {
    private UUID slotId;
    private UUID patient_id;
    private String appointment_type;


    public String getAppointment_type() {
        return appointment_type;
    }

    public void setAppointment_type(String appointment_type) {
        this.appointment_type = appointment_type;
    }

    public UUID getPatient_id() {
        return patient_id;
    }

    public void setPatient_id(UUID patient_id) {
        this.patient_id = patient_id;
    }

    public UUID getSlotId() {
        return slotId;
    }

    public void setSlotId(UUID slotId) {
        this.slotId = slotId;
    }

    @Override
    public String toString() {
        return "MakeAppointment {" +
                "slotId=" + slotId +
                ", patient_id=" + patient_id +
                ", appointment_type='" + appointment_type + '\'' +
                '}';
    }

}

