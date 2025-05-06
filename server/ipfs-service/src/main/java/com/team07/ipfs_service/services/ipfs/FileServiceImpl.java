package com.team07.ipfs_service.services.ipfs;


import com.team07.ipfs_service.dto.HealthRecord;

public interface FileServiceImpl {

    String saveFile(HealthRecord record);
    byte[] loadFile(String hash);
}
