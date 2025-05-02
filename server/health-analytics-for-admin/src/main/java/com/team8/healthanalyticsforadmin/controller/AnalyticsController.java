package com.team8.healthanalyticsforadmin.controller;

import com.team8.healthanalyticsforadmin.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/api/analytics")
    public List<Map<String, Object>> getAnalytics() {
        return analyticsService.fetchAndAnalyzeData();
    }
}
