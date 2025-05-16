package com.team06.appointment_service.dto;


import java.util.UUID;

public class ScheduleSlotDto {

    private UUID slotId;
    private UUID session_id;
    private String status;

    public ScheduleSlotDto() {
    }

    public ScheduleSlotDto(UUID slotId, UUID session_id, String status) {
        this.slotId = slotId;
        this.session_id = session_id;
        this.status = status;
    }


    public UUID getSession_id() {
        return session_id;
    }

    public void setSession_id(UUID session_id) {
        this.session_id = session_id;
    }

    public UUID getSlotId() {
        return slotId;
    }

    public void setSlotId(UUID slotId) {
        this.slotId = slotId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }



    @Override
    public String toString() {
        return "ScheduleSlotDto{" +
                "slot_id=" + slotId +
                ", session_id=" + session_id +
                ", status='" + status + '\'' +
                '}';
    }


}