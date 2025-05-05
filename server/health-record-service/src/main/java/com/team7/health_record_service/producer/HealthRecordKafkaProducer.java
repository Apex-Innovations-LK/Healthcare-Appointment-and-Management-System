package com.team7.health_record_service.producer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team7.health_record_service.constants.KafkaTopics;
import com.team7.health_record_service.dto.HealthRecord;
import com.team7.health_record_service.dto.HealthRecordHashed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class HealthRecordKafkaProducer {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    // ✅ Send raw health record to IPFS microservice
    public void sendToIPFS(HealthRecord record) {
        try {
            String json = objectMapper.writeValueAsString(record);
            kafkaTemplate.send(KafkaTopics.TO_IPFS_TOPIC, json);
            System.out.println("📤 Sent Health Record to IPFS: " + json);
        } catch (Exception e) {
            System.err.println("❌ Failed to send Health Record to IPFS");
            e.printStackTrace();
        }
    }

    // ✅ Send hashed record from IPFS to Blockchain microservice
    public void sendToBlockchain(HealthRecordHashed hashedRecord) {
        try {
            String json = objectMapper.writeValueAsString(hashedRecord);
            kafkaTemplate.send(KafkaTopics.TO_BLOCKCHAIN_TOPIC, json);
            System.out.println("📤 Sent Hashed Record to Blockchain: " + json);
        } catch (Exception e) {
            System.err.println("❌ Failed to send Hashed Record to Blockchain");
            e.printStackTrace();
        }
    }

    // Optional: Send health record to other internal microservices
    public void broadcastHealthRecord(HealthRecord record) {
        try {
            String json = objectMapper.writeValueAsString(record);
            kafkaTemplate.send(KafkaTopics.HEALTH_RECORD_INPUT, json);
            System.out.println("📤 Broadcasted Health Record to topic: " + json);
        } catch (Exception e) {
            System.err.println("❌ Failed to broadcast Health Record");
            e.printStackTrace();
        }
    }
}
