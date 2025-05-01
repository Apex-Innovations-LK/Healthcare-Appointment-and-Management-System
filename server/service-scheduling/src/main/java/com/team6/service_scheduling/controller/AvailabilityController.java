package main.java.com.team6.service_scheduling.controller;

import com.yourorg.scheduling.service.DoctorAvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/schedule")
public class AvailabilityController {

    @Autowired
    private DoctorAvailabilityService availabilityService;

    @GetMapping("/availability")
    public ResponseEntity<Boolean> checkDoctorAvailability(
        @RequestParam UUID doctorId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        boolean isAvailable = availabilityService.isDoctorAvailable(doctorId, date);
        return ResponseEntity.ok(isAvailable);
    }
}