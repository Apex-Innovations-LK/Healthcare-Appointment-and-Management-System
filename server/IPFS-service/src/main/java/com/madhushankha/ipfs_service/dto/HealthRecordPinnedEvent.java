package com.madhushankha.ipfs_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor 
@AllArgsConstructor 
public class HealthRecordPinnedEvent {
    private String recordId;
    private String fileName;
    private String ipfsHash;
    private String uploader;
}