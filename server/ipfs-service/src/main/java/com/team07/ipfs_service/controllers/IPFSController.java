package com.team07.ipfs_service.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.team07.ipfs_service.dto.HealthRecord;
import com.team07.ipfs_service.services.ipfs.IPFSService;

@RestController
public class IPFSController {

    @Autowired
    private IPFSService ipfsService;

    @PostMapping(value = "upload")
    public String saveFile(@RequestBody HealthRecord record){

        System.out.println("Received request: " + record);
        
        return ipfsService.saveFile(record);
    }

    @GetMapping(value = "file/{hash}")
    public ResponseEntity<byte[]> loadFile(@PathVariable("hash") String hash){

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-type", MediaType.ALL_VALUE);
        byte[] file = ipfsService.loadFile(hash);
        return ResponseEntity.status(HttpStatus.OK).headers(httpHeaders).body(file);
    }


}
