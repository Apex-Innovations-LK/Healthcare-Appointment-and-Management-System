package com.team06.serviceschedule.controller;

import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/schedule")
public class UserController {

    @GetMapping("/check")
    public String checkService() {
        return "service-schedule microservice is working!";
    }

}


