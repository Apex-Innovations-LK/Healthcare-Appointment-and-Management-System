package com.example.chat_history_service.repository;

import com.example.chat_history_service.model.ChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {
    
    List<ChatHistory> findBySessionId(String sessionId);
    
    List<ChatHistory> findBySessionIdOrderByTimestampAsc(String sessionId);
    
    List<ChatHistory> findBySender(String sender);

    List<ChatHistory> findByUserId(String userId); // Retrieve all chat history for a user

    List<String> findDistinctSessionIdByUserId(String userId); // Retrieve distinct session IDs for a user
}