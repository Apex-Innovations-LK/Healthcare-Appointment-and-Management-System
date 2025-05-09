package com.team07.ipfs_service.services.ipfs;


import java.util.List;
import java.util.Map;

import com.team07.ipfs_service.dto.HealthRecord;

public interface FileServiceImpl {

    String saveFile(HealthRecord record);
    byte[] loadFile(String hash);
    Map<String, byte[]> loadMultipleFiles(List<String> hashes);
}
