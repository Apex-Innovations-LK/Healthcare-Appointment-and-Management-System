package com.team8.healthanalyticsforadmin.service;

import com.team8.healthanalyticsforadmin.dto.AnalyticsData;
import com.team8.healthanalyticsforadmin.dto.AnalyticsData.Point;
import com.team8.healthanalyticsforadmin.model.HealthRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Builds a compact DTO that the Angular dashboard can consume.
 */
@Service
@RequiredArgsConstructor        // generates ctor for final field(s)
public class AnalyticsService {

    private final RestTemplate restTemplate;

    private static final String RECORDS_URL = "http://localhost:3000/records";
    private static final ZoneId  ZONE       = ZoneId.systemDefault();
    private static final DateTimeFormatter MONTH_FMT =
            DateTimeFormatter.ofPattern("yyyy-MM").withZone(ZONE);

    /* ------------------------------------------------------------------ */
    public AnalyticsData fetchAnalytics() {

        /* 1 ──────────────────────────────────────────────────────────── */
        HealthRecord[] raw = restTemplate
                .exchange(RECORDS_URL, HttpMethod.GET, null, HealthRecord[].class)
                .getBody();

        List<HealthRecord> records = Arrays.asList(Objects.requireNonNull(raw));

        /* 2 ─ Patient‑count timeline  ───────────────────────────────── */
        Map<String, Long> perMonth = records.stream()
                .map(HealthRecord::getDateOfService)
                .filter(s -> s != null && !s.isBlank())
                .map(AnalyticsService::toMonth)                  // yyyy‑MM
                .collect(Collectors.groupingBy(m -> m,
                        TreeMap::new,
                        Collectors.counting()));

        List<Point> patientTimeline = perMonth.entrySet().stream()
                .map(e -> new Point(e.getKey(), e.getValue().intValue()))
                .toList();

        /* 3 ─ Allergies distribution  ───────────────────────────────── */
        Map<String,Integer> allergyCounts = new HashMap<>();
        records.forEach(r -> Optional.ofNullable(r.getAllergies())
                .orElse(List.of())
                .forEach(a -> allergyCounts.merge(a, 1, Integer::sum)));

        /* 4 ─ Problem‑list statistics  ─────────────────────────────── */
        Map<String,Integer> problemCounts = new HashMap<>();
        Map<String,Map<String,Integer>> problemBySex = new HashMap<>();

        records.forEach(r -> {
            String sex = Optional.ofNullable(r.getPatientSex()).orElse("Unknown");
            Map<String,Integer> sexMap = problemBySex.computeIfAbsent(sex, k -> new HashMap<>());

            Optional.ofNullable(r.getProblemList()).orElse(List.of())
                    .forEach(p -> {
                        problemCounts.merge(p, 1, Integer::sum);
                        sexMap.merge(p, 1, Integer::sum);
                    });
        });

        /* 5 ─ DTO out ──────────────────────────────────────────────── */
        return new AnalyticsData(
                patientTimeline,
                allergyCounts,
                problemCounts,
                problemBySex
        );
    }

    /* helper: turn any ISO date string into “yyyy‑MM” */
    private static String toMonth(String iso) {
        // supports “yyyy‑MM‑dd” and full ISO‑instant strings
        try {
            if (iso.length() == 10) {                  // yyyy‑MM‑dd
                return iso.substring(0, 7);
            }
            LocalDate d = LocalDate.parse(iso.substring(0, 10));
            return MONTH_FMT.format(d);
        } catch (Exception ex) {
            return "Unknown";
        }
    }
}
