package com.team06.appointment_service.dto;

import java.util.UUID;

public class AppointmentBookedDto {
    private UUID slotId;
    private String staus;


    public AppointmentBookedDto() {}

    public AppointmentBookedDto(String staus, UUID slotId) {
        this.staus = staus;
        this.slotId = slotId;
    }

    public UUID getSlotId() {
        return slotId;
    }

    public void setSlotId(UUID slotId) {
        this.slotId = slotId;
    }

    public String getStaus() {
        return staus;
    }

    public void setStaus(String staus) {
        this.staus = staus;
    }

}
