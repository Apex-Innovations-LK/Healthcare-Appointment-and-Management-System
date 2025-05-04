package com.example.chat_history_service.service;

import com.example.chat_history_service.model.ChatHistory;
import com.example.chat_history_service.repository.ChatHistoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class ChatHistoryConsumer {

    @Autowired
    private ChatHistoryRepository repository;

    @KafkaListener(topics = "chat-history-topic", groupId = "chat-history-group")
    public void listen(String messageJson) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> map = mapper.readValue(messageJson, Map.class);

        ChatHistory history = new ChatHistory();
        history.setSessionId((String) map.get("sessionId"));
        history.setSender((String) map.get("sender"));
        history.setMessage((String) map.get("content"));
        history.setTimestamp(LocalDateTime.now());

        repository.save(history);
    }
}