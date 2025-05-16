package com.example.chat_history_service.service;

import com.example.chat_history_service.model.ChatHistory;
import com.example.chat_history_service.repository.ChatHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatHistoryService {

    @Autowired
    private ChatHistoryRepository chatHistoryRepository;

    // Get all chat sessions for a user
    public List<String> getUserSessions(String userId) {
        return chatHistoryRepository.findDistinctSessionIdByUserIdOrderbyFirstTimestamp(userId);
    }

    // Get complete chat history for a session
    public List<ChatHistory> getSessionHistory(String sessionId) {
        return chatHistoryRepository.findBySessionIdOrderByTimestampAsc(sessionId);
    }
}