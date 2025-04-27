package com.madhushankha.ipfs_demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class IPFSController {

    @Autowired
    private IPFSService ipfsService;

    @PostMapping(value = "upload")
    public String saveFile(@RequestParam ("file")MultipartFile file){

        return ipfsService.saveFile(file);
    }

    @GetMapping(value = "file/{hash}")
    public ResponseEntity<byte[]> loadFile(@PathVariable("hash") String hash){

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-type", MediaType.ALL_VALUE);
        byte[] file = ipfsService.loadFile(hash);
        return ResponseEntity.status(HttpStatus.OK).headers(httpHeaders).body(file);
    }


}
