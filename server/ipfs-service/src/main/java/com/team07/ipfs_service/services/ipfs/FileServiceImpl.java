package com.team07.ipfs_service.services.ipfs;

import org.springframework.web.multipart.MultipartFile;

public interface FileServiceImpl {

    String saveFile(MultipartFile file);
    byte[] loadFile(String hash);
}
