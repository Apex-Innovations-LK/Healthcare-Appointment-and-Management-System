package com.springboot.healthcare.event;

public class UsernameResponseEvent {
    private final String userId;
    private final String username;

    public UsernameResponseEvent(String userId, String username) {
        this.userId = userId;
        this.username = username;
    }

    public String getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }
} 