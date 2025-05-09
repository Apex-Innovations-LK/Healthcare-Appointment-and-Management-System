package com.team06.appointment_service.dto;


import java.util.UUID;

public class SessionIdDto {

    private UUID session_id;

    public SessionIdDto() {
    }

    public SessionIdDto(UUID session_id) {
        this.session_id = session_id;
    }

    public UUID getSession_id() {
        return session_id;
    }

    public void setSession_id(UUID session_id) {
        this.session_id = session_id;
    }


}