package com.team8.healthanalytics.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team8.healthanalytics.dto.AnalyticsData;
import com.team8.healthanalytics.dto.AnalyticsData.Point;
import com.team8.healthanalytics.model.HealthRecord;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService implements Serializable {
    private static final long serialVersionUID = 1L;

    private final ObjectMapper objectMapper;

    private static final String JSON_FILE_PATH = "health_records.json";
            
    // Constructor to replace @RequiredArgsConstructor
    public AnalyticsService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /* ─────────────────────────────────────────────────────── */
    public AnalyticsData fetchAnalytics() {
        List<HealthRecord> records;
        try {
            // Load health records from the local JSON file
            ClassPathResource resource = new ClassPathResource(JSON_FILE_PATH);
            try (InputStream inputStream = resource.getInputStream()) {
                HealthRecord[] raw = objectMapper.readValue(inputStream, HealthRecord[].class);
                records = Arrays.asList(Objects.requireNonNull(raw));
            }
        } catch (IOException e) {
            // Log error and return empty data in case of failure
            e.printStackTrace();
            return new AnalyticsData(
                    Collections.emptyList(),
                    Collections.emptyMap(),
                    Collections.emptyMap(),
                    Collections.emptyMap()
            );
        }

        /* 1 ─ Distinct‑patient count / month */
        Map<String, Long> perMonth = records.stream()
                .filter(r -> r.getDateOfService() != null && !r.getDateOfService().isEmpty())
                .map(r -> toMonth(r.getDateOfService()))
                .collect(Collectors.groupingBy(m -> m, TreeMap::new, Collectors.counting()));

        List<Point> patientTimeline = perMonth.entrySet().stream()
                .map(e -> new Point(e.getKey(), e.getValue().intValue()))
                .collect(Collectors.toList());

        /* 2 ─ Allergy distribution */
        Map<String,Integer> allergyCounts = new HashMap<>();
        records.forEach(r -> {
            if (r.getAllergies() != null) {
                r.getAllergies().forEach(a -> allergyCounts.merge(a,1,Integer::sum));
            }
        });

        /* 3 ─ Problem statistics */
        Map<String,Integer> problemCounts = new HashMap<>();
        Map<String,Map<String,Integer>> bySex = new HashMap<>();

        records.forEach(r -> {
            String sex = r.getPatientSex() != null ? r.getPatientSex() : "Unknown";
            Map<String,Integer> sexMap = bySex.computeIfAbsent(sex, k -> new HashMap<>());
            
            if (r.getProblemList() != null) {
                r.getProblemList().forEach(p -> {
                    problemCounts.merge(p,1,Integer::sum);
                    sexMap.merge(p,1,Integer::sum);
                });
            }
        });

        /* 4 ─ Build DTO */
        return new AnalyticsData(
                patientTimeline,
                allergyCounts,
                problemCounts,
                bySex
        );
    }

    /* ========== helpers =================================== */
    private String toMonth(String iso) {
        try { 
            return iso.substring(0,7); 
        } catch (Exception e) { 
            return "Unknown"; 
        }
    }
}
