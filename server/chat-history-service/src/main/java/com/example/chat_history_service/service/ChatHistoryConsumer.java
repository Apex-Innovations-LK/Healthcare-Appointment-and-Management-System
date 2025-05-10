package com.example.chat_history_service.service;

import com.example.chat_history_service.model.ChatHistory;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.chat_history_service.repository.ChatHistoryRepository; // Not needed
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;

@Service
public class ChatHistoryConsumer {

    private static final Logger logger = LoggerFactory.getLogger(ChatHistoryConsumer.class);

    // Remove or comment out repository to avoid bean injection issues
    @Autowired
     private ChatHistoryRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    @KafkaListener(topics = "chat-history-topic", groupId = "chat-history-group")
    public void listen(String messageJson) {
        try {
            Map<String, Object> messageMap = objectMapper.readValue(messageJson, Map.class);

            ChatHistory history = new ChatHistory();
            history.setSessionId((String) messageMap.get("sessionId"));
            history.setSender((String) messageMap.get("sender"));
            history.setMessage((String) messageMap.get("content"));

            // Handle timestamp conversion from epoch milliseconds if available
            if (messageMap.containsKey("timestamp") && messageMap.get("timestamp") instanceof Number) {
                Long timestamp = ((Number) messageMap.get("timestamp")).longValue();
                LocalDateTime messageTime = LocalDateTime.ofInstant(
                        Instant.ofEpochMilli(timestamp),
                        ZoneId.systemDefault()
                );
                history.setTimestamp(messageTime);
            } else {
                history.setTimestamp(LocalDateTime.now());
            }

            repository.save(history);
            logger.info("Received chat message: sessionId={}, sender={}, message={}",
                    history.getSessionId(), history.getSender(), history.getMessage());

        } catch (Exception e) {
            logger.error("Error processing Kafka message: {}", e.getMessage(), e);
        }
    }
}
