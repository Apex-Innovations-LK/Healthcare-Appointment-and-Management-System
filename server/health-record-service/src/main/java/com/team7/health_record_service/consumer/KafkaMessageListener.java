package com.team7.health_record_service.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team7.health_record_service.dto.HealthRecord;
import com.team7.health_record_service.dto.HealthRecordHashed;
// import com.yourcompany.healthrecordservice.model.HealthRecordRequest;
// import com.yourcompany.healthrecordservice.model.HealthRecordHashed;
import com.team7.health_record_service.producer.HealthRecordKafkaProducer;
import com.team7.health_record_service.constants.KafkaTopics;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaMessageListener {

    @Autowired
    private HealthRecordKafkaProducer producer;

    @Autowired
    private ObjectMapper objectMapper;

    // Step 1: Listen to health records from other microservices
    @KafkaListener(topics = KafkaTopics.HEALTH_RECORD_INPUT, groupId = "health-record-group")
    public void consumeHealthRecord(String message) {
        try {
            HealthRecord record = objectMapper.readValue(message, HealthRecord.class);
            System.out.println("✅ Consumed Health Record: " + record);

            // Forward to IPFS service
            // String recordJson = objectMapper.writeValueAsString(record);
            producer.sendToIPFS( record);
            System.out.println("➡️ Sent to IPFS topic");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Step 2: Listen to hashed data from IPFS
    @KafkaListener(topics = KafkaTopics.FROM_IPFS_TOPIC, groupId = "health-record-group")
    public void consumeHashedData(String message) {
        try {
            HealthRecordHashed hashed = objectMapper.readValue(message, HealthRecordHashed.class);
            System.out.println("✅ Consumed Hashed Record from IPFS: " + hashed);

            // Forward to Blockchain service
            // String hashedJson = objectMapper.writeValueAsString(hashed);
            producer.sendToBlockchain( hashed);
            System.out.println("➡️ Sent to Blockchain topic");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Step 3: Listen to patient ID from other microservices
    @KafkaListener(topics = KafkaTopics.PATIENT_ID_STRING, groupId = "health-record-group")
    public void consumePatientId(String message) {
        try {
            // Process patient ID
            System.out.println("✅ Consumed Patient ID: " + message);
            // You can add logic to handle the patient ID here
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
