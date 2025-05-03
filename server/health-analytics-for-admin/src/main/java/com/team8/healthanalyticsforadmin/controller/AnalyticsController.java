package com.team8.healthanalyticsforadmin.controller;

import com.team8.healthanalyticsforadmin.dto.AnalyticsData;
import com.team8.healthanalyticsforadmin.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")   // single place for CORS
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/api/analytics")
    public AnalyticsData analytics() {
        return analyticsService.fetchAnalytics();
    }
}
