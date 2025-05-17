package com.example.chat_history_service.controller;

import com.example.chat_history_service.model.ChatHistory;
import com.example.chat_history_service.service.ChatHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins ="http://localhost:4200")
@RestController
@RequestMapping("/api/chat-history")
public class ChatHistoryController {
    @Autowired
    private ChatHistoryService chatHistoryService;

    // Endpoint to get all sessions for a user
    @GetMapping("/sessions/{userId}")
    public List<Object[]> getUserSessions(@PathVariable String userId) {
        return chatHistoryService.getUserSessions(userId);
    }

    // Endpoint to get complete history of a session
    @GetMapping("/session/{sessionId}")
    public List<ChatHistory> getSessionHistory(@PathVariable String sessionId) {
        return chatHistoryService.getSessionHistory(sessionId);
    }
}

