package com.team07.blockchain_service.services.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team07.blockchain_service.dto.HealthRecordHashed;
import com.team07.blockchain_service.constants.KafkaTopics;
import com.team07.blockchain_service.services.blockchain.BlockchainService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class BlockchainListener {

    private final ObjectMapper objectMapper;
    private final BlockchainService blockchainService;

    @Autowired
    public BlockchainListener(ObjectMapper objectMapper, BlockchainService blockchainService) {
        this.objectMapper = objectMapper;
        this.blockchainService = blockchainService;
    }

    @KafkaListener(topics = KafkaTopics.BLOCKCHAIN_TOPIC, groupId = "blockchain-group")
    public void consumeHashedRecord(String message) {
        try {
            // Deserialize the JSON message to HealthRecordHashed DTO
            HealthRecordHashed hashedRecord = objectMapper.readValue(message, HealthRecordHashed.class);
            System.out.println("✅ Consumed Hashed Record from Kafka: " + hashedRecord);

            // Call blockchain service to register the record
            String result = blockchainService.registerHealthRecord(hashedRecord);
            System.out.println("📦 Blockchain response: " + result);

        } catch (Exception e) {
            System.err.println("❌ Error processing hashed record: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
