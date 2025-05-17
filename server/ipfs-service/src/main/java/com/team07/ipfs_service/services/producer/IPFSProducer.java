package com.team07.ipfs_service.services.producer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team07.ipfs_service.constants.KafkaTopics;
import com.team07.ipfs_service.dto.HealthRecordHashed;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class IPFSProducer {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void sendToBlockchain(HealthRecordHashed hashedRecord) {
        try {
            String json = objectMapper.writeValueAsString(hashedRecord);
            kafkaTemplate.send(KafkaTopics.BLOCKCHAIN_TOPIC, json);
            System.out.println("Sent Hashed Record to Blockchain: " + json);
        } catch (Exception e) {
            System.err.println("Failed to send Hashed Record to Blockchain");
            e.printStackTrace();
        }
    }

}