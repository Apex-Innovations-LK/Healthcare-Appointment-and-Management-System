package com.team06.serviceschedule.controller;

import com.team06.serviceschedule.dto.ScheduleDto;
import com.team06.serviceschedule.dto.StaffRequest;
import com.team06.serviceschedule.service.SchedularService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "http://35.184.60.72")
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

    @PostMapping("/get-schedule")
    public List<ScheduleDto> getSchedule(@RequestBody Map<String, UUID> payload) {
        UUID staffId = payload.get("staff_id");
        return schedularService.getSchedule(staffId);
    }

}

