package com.healthcare.chat.controller;

import com.healthcare.chat.model.ChatMessage;
import com.healthcare.chat.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/message")
    public ResponseEntity<ChatMessage> chat(
            @RequestParam String sessionId,
            @RequestBody String userMessage) {
        ChatMessage response = chatService.sendMessage(sessionId, userMessage);
        return ResponseEntity.ok(response);
    }
}