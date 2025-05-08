package com.healthcare.chat.controller;

import com.healthcare.chat.model.ChatMessage;
import com.healthcare.chat.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping(value = "/{sessionId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ChatMessage> processChat(
            @PathVariable String sessionId,
            @RequestParam("message") String message,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        ChatMessage response = chatService.sendMessage(sessionId, message, image);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{sessionId}/text")
    public ResponseEntity<ChatMessage> processTextChat(
            @PathVariable String sessionId,
            @RequestBody Map<String, String> payload) {
        
        String message = payload.getOrDefault("message", "");
        ChatMessage response = chatService.sendMessage(sessionId, message, null);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "chat-service");
        return ResponseEntity.ok(status);
    }
}