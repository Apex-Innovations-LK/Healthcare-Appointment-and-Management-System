package com.team8.healthanalytics.controller;

import com.team8.healthanalytics.dto.AnalyticsData;
import com.team8.healthanalytics.service.AnalyticsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:4200")   // single place for CORS
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/api/analytics")
    public AnalyticsData analytics() {
        return analyticsService.fetchAnalytics();
    }
}
