package com.springboot.healthcare.controller;

import com.springboot.healthcare.dto.AuthResponse;
import com.springboot.healthcare.model.Users;
import com.springboot.healthcare.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;


    @PostMapping("/register")
    public AuthResponse register(@RequestBody Users user) {
        return userService.register(user);
    }
//@PostMapping("/register")
//public ResponseEntity<AuthResponse> register(@RequestBody Users user, HttpServletResponse response) {
//    AuthResponse authResponse = userService.register(user);
//
//    if (authResponse.getToken() != null && !authResponse.getToken().isEmpty()) {
//        Cookie cookie = new Cookie("jwt", authResponse.getToken());
//        cookie.setHttpOnly(true);
//        cookie.setSecure(false); // Set to true in production (HTTPS)
//        cookie.setPath("/");
//        cookie.setMaxAge(24 * 60 * 60); // 1 day
//
//        response.addCookie(cookie);
//        return ResponseEntity.ok(new AuthResponse("", authResponse.getUsername(), "Registration successful (token in cookie)"));
//    } else {
//        return ResponseEntity.status(500).body(new AuthResponse("", "", "Registration failed"));
//    }
//}


    @PostMapping("/login")
    public AuthResponse login(@RequestBody Users user) {
        return userService.verify(user);
    }


//    @PostMapping("/login")
//    public ResponseEntity<AuthResponse> login(@RequestBody Users user, HttpServletResponse response) {
//        AuthResponse authResponse = userService.verify(user);
//
//        if (authResponse.getToken() != null && !authResponse.getToken().isEmpty()) {
//            Cookie cookie =
//                    new Cookie("jwt", authResponse.getToken());
//            cookie.setHttpOnly(true);
//            cookie.setSecure(false); // set to true in production (HTTPS)
//            cookie.setPath("/");
//            cookie.setMaxAge(24 * 60 * 60); // 1 day
//
//            response.addCookie(cookie);
//            return ResponseEntity.ok(new AuthResponse("", authResponse.getUsername(), "Login Successful (token in cookie)"));
//        } else {
//            return ResponseEntity.status(401).body(new AuthResponse("", "", "Login failed"));
//        }
//    }

}
