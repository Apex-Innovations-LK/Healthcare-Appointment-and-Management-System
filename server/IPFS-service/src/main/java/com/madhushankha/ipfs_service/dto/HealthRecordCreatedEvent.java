package com.madhushankha.ipfs_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@NoArgsConstructor 
@AllArgsConstructor 
public class HealthRecordCreatedEvent {
    private String recordId;
    private String fileName;
    private String uploader;
    private String fileContentBase64;
}