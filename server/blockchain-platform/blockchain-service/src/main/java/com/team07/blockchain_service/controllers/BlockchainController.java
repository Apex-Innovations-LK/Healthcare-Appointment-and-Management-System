package com.team07.blockchain_service.controllers;

import com.team07.blockchain_service.dto.HealthRecordHashed;
import com.team07.blockchain_service.services.blockchain.BlockchainService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api") // Base path for API versioning and clarity
public class BlockchainController {

    private final BlockchainService blockchainService;

    public BlockchainController(BlockchainService blockchainService) {
        this.blockchainService = blockchainService;
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("✅ Blockchain service is running");
    }

    // Register a health record after IPFS hash is created
    @PostMapping("/record")
    public ResponseEntity<String> registerHealthRecord(@RequestBody HealthRecordHashed record) {
        try {
            String result = blockchainService.registerHealthRecord(record);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("❌ Failed to register record: " + e.getMessage());
        }
    }

    // Query a health record by record ID
    @GetMapping("/record/{recordId}")
    public ResponseEntity<String> queryHealthRecord(@PathVariable String recordId) {
        try {
            String result = blockchainService.queryHealthRecord(recordId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("❌ Failed to query record: " + e.getMessage());
        }
    }

    // Query all records for a patient ID
    @GetMapping("/records/patient/{patientId}")
    public ResponseEntity<String> queryRecordsByPatient(@PathVariable String patientId) {
        try {
            String result = blockchainService.queryRecordsByPatient(patientId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("❌ Failed to query patient records: " + e.getMessage());
        }
    }

    @GetMapping("/record/full/{recordId}")
    public ResponseEntity<String> getActualRecordFromIPFS(@PathVariable String recordId) {
        try {
            String fullRecord = blockchainService.queryHealthRecordAndFetch(recordId);
            return ResponseEntity.ok(fullRecord);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("❌ Failed to fetch actual record: " + e.getMessage());
        }
    }

}
