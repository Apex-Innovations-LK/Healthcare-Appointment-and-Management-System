package com.springboot.healthcare.dto;

public class AuthResponse {

    private String token;
    private String username;
    private String role;
    private String status;
    private String message;

    // constructor
    public AuthResponse(String token, String username,String role, String status,  String message) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.status = status;
        this.message = message;
    }

    // getters and setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


}
