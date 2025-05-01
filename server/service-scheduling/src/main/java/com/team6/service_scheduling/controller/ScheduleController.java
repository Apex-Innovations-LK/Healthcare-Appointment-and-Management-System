package com.team6.service_scheduling.controller;

import java.time.LocalDate;
import java.util.Collections;
import java.util.UUID;

import com.team6.service_scheduling.service.ScheduleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/schedule")
@CrossOrigin
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping("/check-availability")
    public ResponseEntity<?> checkDoctorAvailability(
            @RequestParam UUID doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        boolean available = scheduleService.isDoctorAvailableOnDate(doctorId, date);
        return ResponseEntity.ok(Collections.singletonMap("available", available));
    }
}
