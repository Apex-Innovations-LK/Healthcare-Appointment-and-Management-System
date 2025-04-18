package com.madhushankha.ipfs_demo;

import org.springframework.web.multipart.MultipartFile;

public interface FileServiceImpl {

    String saveFile(MultipartFile file);
    byte[] loadFile(String hash);
}
