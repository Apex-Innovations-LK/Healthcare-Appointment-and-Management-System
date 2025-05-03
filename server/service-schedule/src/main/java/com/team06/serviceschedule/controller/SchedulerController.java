package com.team06.serviceschedule.controller;

import com.team06.serviceschedule.service.SchedularService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
public class SchedulerController {

    private final SchedularService schedularService;

    @PostMapping("/run")
    public String runScheduler() {
        return schedularService.runScheduler();
    }
}
