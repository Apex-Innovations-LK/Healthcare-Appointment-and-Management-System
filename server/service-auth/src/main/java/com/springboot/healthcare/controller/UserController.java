package com.springboot.healthcare.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.springboot.healthcare.dto.AuthResponse;
import com.springboot.healthcare.dto.DoctorDetails;
import com.springboot.healthcare.dto.RegisterRequest;
import com.springboot.healthcare.dto.UserDetailsDto;
import com.springboot.healthcare.model.Users;
import com.springboot.healthcare.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) throws JsonProcessingException {
        return userService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody Users user) {
        return userService.verify(user);
    }

    @PostMapping("/get-user")
    public Optional<Users> getUser(@RequestBody String username) {
        return userService.getUserByUsername(username);
    }


    @PostMapping("/users")
    public List<Users> getUsers() {
        return userService.getUsers();
    }

    @GetMapping("/get-count")
    public Map<String, Long> getCount() {
        return userService.getCount();
    }

    @GetMapping("/fetch-doctors")
    public List<DoctorDetails> fetchAllDoctors() {
        return userService.fetchAllDoctors();
    }

    @PostMapping("/fetch-user-info")
    public UserDetailsDto fetchUserInfo(@RequestBody String id) {
        String cleanId = id.replace("\"", "").trim();
        System.out.println("id: " + cleanId);
        UUID patient_id = UUID.fromString(cleanId);
        System.out.println("slotId: " + patient_id);
        return userService.fetchUserInfo(patient_id);
    }
}
