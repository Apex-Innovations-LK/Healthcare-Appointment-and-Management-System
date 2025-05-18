package com.healthcare.chat.model;

import java.util.ArrayList;
import java.util.List;

public class ChatSession {
    private String sessionId;
    private List<ChatMessage> messages = new ArrayList<>();

    public ChatSession(String sessionId) {
        this.sessionId = sessionId;
        messages.add(new ChatMessage("system", "You are a health assistant."));

    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public List<ChatMessage> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessage> messages) {
        this.messages = messages;
    }
}
