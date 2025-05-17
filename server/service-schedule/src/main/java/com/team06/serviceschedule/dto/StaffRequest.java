package com.team06.serviceschedule.dto;

import java.util.UUID;

public class StaffRequest {
    private UUID staff_id;

    public UUID getStaff_id() {
        return staff_id;
    }

    public void setStaff_id(UUID staff_id) {
        this.staff_id = staff_id;
    }
}
