package com.team06.serviceschedule.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserKafkaEvent {

    private UUID userId;
    private String username;
    private String email;
    private String role;

}
