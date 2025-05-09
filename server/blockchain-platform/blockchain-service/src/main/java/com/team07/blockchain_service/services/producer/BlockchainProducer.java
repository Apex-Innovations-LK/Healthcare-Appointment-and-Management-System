package com.team07.blockchain_service.services.producer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team07.blockchain_service.dto.HealthRecordHashed;
import com.team07.blockchain_service.constants.KafkaTopics;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class BlockchainProducer {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Send hashed health record to blockchain service via Kafka
     * 
     * @param hashedRecord The health record object with IPFS hash
     */
    public void sendToBlockchain(HealthRecordHashed hashedRecord) {
        try {
            // Convert HealthRecordHashed object to JSON
            String json = objectMapper.writeValueAsString(hashedRecord);

            // Send to the blockchain topic
            kafkaTemplate.send(KafkaTopics.BLOCKCHAIN_TOPIC, json);

            System.out.println("Sent Hashed Record to Blockchain: " + json);
        } catch (Exception e) {
            // Log error if something goes wrong
            System.err.println("Failed to send Hashed Record to Blockchain");
            e.printStackTrace();
        }
    }
}
