package com.team06.serviceschedule.dto;

import java.util.Date;
import java.util.UUID;

public class ScheduleInfoDto {

    private UUID session_id;
    private UUID doctor_id;
    private UUID staff_id;
    private Date from;
    private Date to;

    public ScheduleInfoDto() {}

    public ScheduleInfoDto(UUID session_id, UUID doctor_id, UUID staff_id, Date from, Date to) {
        this.session_id = session_id;
        this.doctor_id = doctor_id;
        this.staff_id = staff_id;
        this.from = from;
        this.to = to;
    }

    public Date getTo() {
        return to;
    }

    public void setTo(Date to) {
        this.to = to;
    }

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


}
