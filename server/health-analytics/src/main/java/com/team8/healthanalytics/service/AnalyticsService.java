package com.team8.healthanalytics.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team8.healthanalytics.dto.AnalyticsData;
import com.team8.healthanalytics.dto.AnalyticsData.Point;
import com.team8.healthanalytics.model.HealthRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.io.InputStream;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final String JSON_FILE_PATH = "health_records.json";
    private static final ZoneId ZONE = ZoneId.systemDefault();
    private static final DateTimeFormatter MONTH_FMT =
            DateTimeFormatter.ofPattern("yyyy-MM").withZone(ZONE);

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
                    Collections.emptyMap(),
                    Collections.emptyMap()
            );
        }

        /* 1 ─ Distinct‑patient count / month */
        Map<String, Long> perMonth = records.stream()
                .map(r -> r.getDateOfService())
                .filter(s -> s != null && !s.isBlank())
                .map(AnalyticsService::toMonth)
                .collect(Collectors.groupingBy(m -> m, TreeMap::new, Collectors.counting()));

        List<Point> patientTimeline = perMonth.entrySet().stream()
                .map(e -> new Point(e.getKey(), e.getValue().intValue()))
                .collect(Collectors.toList());

        /* 2 ─ Allergy distribution */
        Map<String,Integer> allergyCounts = new HashMap<>();
        records.forEach(r -> Optional.ofNullable(r.getAllergies()).orElse(List.of())
                .forEach(a -> allergyCounts.merge(a,1,Integer::sum)));

        /* 3 ─ Problem statistics */
        Map<String,Integer> problemCounts  = new HashMap<>();
        Map<String,Map<String,Integer>> bySex = new HashMap<>();

        records.forEach(r -> {
            String sex = Optional.ofNullable(r.getPatientSex()).orElse("Unknown");
            Map<String,Integer> sexMap = bySex.computeIfAbsent(sex, k -> new HashMap<>());
            Optional.ofNullable(r.getProblemList()).orElse(List.of())
                    .forEach(p -> {
                        problemCounts.merge(p,1,Integer::sum);
                        sexMap.merge(p,1,Integer::sum);
                    });
        });

        /* 4 ─ Risk‑category calculation (Low / Moderate / High) */
        Map<String,Integer> riskCounts = new HashMap<>(Map.of(
                "Low",0,"Moderate",0,"High",0));

        records.forEach(r -> {
            int score = computeRiskScore(r);
            String cat = score >= 8 ? "High" : score >= 4 ? "Moderate" : "Low";
            riskCounts.merge(cat,1,Integer::sum);
        });

        /* 5 ─ Build DTO */
        return new AnalyticsData(
                patientTimeline,
                allergyCounts,
                problemCounts,
                bySex,
                riskCounts
        );
    }

    /* ========== helpers =================================== */
    private static String toMonth(String iso) {
        try { return iso.substring(0,7); } catch (Exception e) { return "Unknown"; }
    }

    /** simplistic rule‑based score – adjust as you see fit */
    private static int computeRiskScore(HealthRecord r) {
        int base = 0;
        base += Optional.ofNullable(r.getProblemList()).orElse(List.of()).size();
        base += Optional.ofNullable(r.getMedications()).orElse(List.of()).size() / 2;
        base += Optional.ofNullable(r.getAllergies()).orElse(List.of()).size() / 3;
        return base;
    }
}
