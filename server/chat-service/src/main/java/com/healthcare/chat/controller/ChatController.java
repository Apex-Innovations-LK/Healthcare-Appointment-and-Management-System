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
@CrossOrigin(origins ="http://localhost:4200")
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;
    @PostMapping(value = "/message", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ChatMessage> chat(
            @RequestParam("sessionId") String sessionId,
            @RequestParam(value= "UserID", required = false, defaultValue = "guest") String userId, //change and remove default
            @RequestParam("question") String userMessage,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        ChatMessage response = chatService.sendMessage(sessionId,userId, userMessage, image);
        return ResponseEntity.ok(response);
    }

}