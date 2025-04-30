package com.team06.serviceschedule.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorKafkaEvent {
    private UUID doctor_id;
    private UUID session_id;
    private Date from;
    private Date to;
    private int number_of_patients;


    public Date getFrom() {
        return from;
    }

    public UUID getDoctor_id() {
        return doctor_id;
    }

    public UUID getSession_id() {
        return session_id;
    }

    public Date getTo() {
        return to;
    }

    public int getNumber_of_patients() {
        return number_of_patients;
    }

}
