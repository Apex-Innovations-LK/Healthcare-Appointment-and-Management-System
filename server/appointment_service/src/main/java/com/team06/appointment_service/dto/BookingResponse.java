package com.team06.appointment_service.dto;

import java.util.Date;

public class BookingResponse {

    private String name;
    private String date;

    public BookingResponse(String name, String date) {
        this.name = name;
        this.date = date;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getName() {
        return name;
    }


}
