package com.team07.ipfs_service.domain;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "health_records")
@Data
public class HealthRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String recordId;

    @Column(nullable = false)
    private String patientId;

    @Column(nullable = false)
    private String doctorId;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false, unique = true)
    private String ipfsHash;

    @Column(nullable = false)
    private LocalDateTime timestamp;

}