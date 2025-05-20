package com.example.chat_history_service.repository;

import com.example.chat_history_service.model.ChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;



@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {


    //List<ChatHistory> findBySessionIdAndUserIdOrderByTimestampAsc(String sessionId, String userId);
    
    //List<ChatHistory> findBySessionId(String sessionId);
    @Query("SELECT c FROM ChatHistory c WHERE c.sessionId = :sessionId ORDER BY c.timestamp ASC")
    List<ChatHistory> findBySessionIdOrderByTimestampAsc(String sessionId);
    
   // List<ChatHistory> findBySender(String sender);

    //List<ChatHistory> findByUserId(String userId); // Retrieve all chat history for a user
    @Query("SELECT c.sessionId, MIN(c.timestamp)" +
            "FROM ChatHistory c " +
            "WHERE c.userId = :userId " +
            "GROUP BY c.sessionId " +
            "ORDER BY MIN(c.timestamp) ASC")
    List<Object[]> findDistinctSessionIdByUserIdOrderbyFirstTimestamp(String userId); // Retrieve distinct session IDs for a user
}