package com.healthcare.chat.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthcare.chat.model.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ChatKafkaProducer {
    
    private static final String TOPIC = "chat-history-topic";
    
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    public void sendChatMessage(String sessionId, String userId, String user, ChatMessage message) {
        try {
            Map<String, Object> messagePayload = new HashMap<>();
            messagePayload.put("sessionId", sessionId);
            messagePayload.put("userId", userId);
            messagePayload.put("role",user);
            messagePayload.put("content", message.getContent());
            messagePayload.put("timestamp", System.currentTimeMillis());
            
            String messageJson = objectMapper.writeValueAsString(messagePayload);
            kafkaTemplate.send(TOPIC, sessionId, messageJson);
        } catch (JsonProcessingException e) {
            // Log the error instead of just printing
            System.err.println("Failed to serialize chat message: " + e.getMessage());
        }
    }
}