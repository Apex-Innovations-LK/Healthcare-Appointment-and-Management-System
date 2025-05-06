package com.team06.serviceschedule.controller;

import com.team06.serviceschedule.service.SchedularService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/schedule")
public class SchedulerController {

    @Autowired
    private SchedularService schedularService;

    @GetMapping("/run")
    public ResponseEntity<Map<String, String>> runSchedular() {
        return schedularService.runScheduler();
    }

    @GetMapping("/get-count")
    public Map<String, Long> getCount() {
        return schedularService.getCount();
    }
}

