package com.team06.serviceschedule.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SessionAssignment {

    @Id
    private UUID session_id;
    private UUID doctor_id;
    private UUID staff_id;
    @Column(name = "\"from\"")
    private Date from;
    @Column(name = "\"to\"")
    private Date to;
    private int number_of_patients;
}
