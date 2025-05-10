package com.team07.ipfs_service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.team07.ipfs_service.constants.KafkaTopics;
import com.team07.ipfs_service.dto.HealthRecordHashed;
import com.team07.ipfs_service.services.producer.IPFSProducer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class IPFSProducerTest {

    @Mock
    private KafkaTemplate<String, String> kafkaTemplate;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private IPFSProducer ipfsProducer;

    private HealthRecordHashed hashedRecord;
    private String serializedJson;

    @BeforeEach
    void setUp() {
        hashedRecord = new HealthRecordHashed("record123", "patient456", "doctor789", "QmHash");
        serializedJson = "{\"recordId\":\"record123\",\"patientId\":\"patient456\",\"doctorId\":\"doctor789\",\"ipfsHash\":\"QmHash\"}";
    }

    @Test
    void testSendToBlockchain() throws JsonProcessingException {
        // Setup
        when(objectMapper.writeValueAsString(hashedRecord)).thenReturn(serializedJson);
        
        // Execute
        ipfsProducer.sendToBlockchain(hashedRecord);
        
        // Verify
        verify(objectMapper).writeValueAsString(hashedRecord);
        verify(kafkaTemplate).send(eq(KafkaTopics.BLOCKCHAIN_TOPIC), eq(serializedJson));
    }

    @Test
    void testSendToBlockchain_handlesException() throws JsonProcessingException {
        // Setup
        when(objectMapper.writeValueAsString(hashedRecord)).thenThrow(new JsonProcessingException("Error serializing") {});
        
        // Execute
        ipfsProducer.sendToBlockchain(hashedRecord);
        
        // Verify - should handle the exception and not propagate it
        verify(objectMapper).writeValueAsString(hashedRecord);
        verify(kafkaTemplate, never()).send(anyString(), anyString());
    }
}