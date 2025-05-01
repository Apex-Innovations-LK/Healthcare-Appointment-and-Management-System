package com.springboot.healthcare.controller;

import com.springboot.healthcare.dto.AuthResponse;
import com.springboot.healthcare.model.Users;
import com.springboot.healthcare.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth service is running");
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody Users user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody Users user) {
        return userService.verify(user);
    }

    @GetMapping("/username/{userId}")
    public ResponseEntity<String> getUsername(@PathVariable String userId) {
        Users user = userService.getUserById(userId);
        if (user != null) {
            return ResponseEntity.ok(user.getUsername());
        }
        return ResponseEntity.notFound().build();
    }
}
