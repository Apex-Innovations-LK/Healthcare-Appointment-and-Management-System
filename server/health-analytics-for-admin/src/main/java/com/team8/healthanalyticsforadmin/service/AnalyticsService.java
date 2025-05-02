package com.team8.healthanalyticsforadmin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private RestTemplate restTemplate;

    private static final String RECORDS_URL = "http://localhost:3000/records";

    public List<Map<String, Object>> fetchAndAnalyzeData() {
        // Fetch data from the external API
        ResponseEntity<List> response = restTemplate.exchange(RECORDS_URL, HttpMethod.GET, null, List.class);
        List<Map<String, Object>> records = response.getBody();

        // Process the data (you can add your analysis here)
        for (Map<String, Object> record : records) {
            // Example: Analyzing patient age from dob and categorizing risk
            String dob = (String) record.get("patient_dob");
            String riskCategory = calculateRiskCategory(dob);
            record.put("riskCategory", riskCategory);
        }

        return records;
    }

    private String calculateRiskCategory(String dob) {
        // Calculate the patient's age from their dob and categorize risk
        // Example logic: Age-based risk
        int age = 2025 - Integer.parseInt(dob.substring(0, 4)); // Simple age calculation (year - year of birth)

        if (age > 65) {
            return "High Risk";
        } else if (age > 45) {
            return "Moderate Risk";
        } else {
            return "Low Risk";
        }
    }
}
