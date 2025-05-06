package com.team8.healthanalytics.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team8.healthanalytics.dto.AnalyticsData;
import com.team8.healthanalytics.dto.AnalyticsData.Point;
import com.team8.healthanalytics.model.HealthRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.apache.spark.sql.SparkSession;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService implements Serializable {
    private static final long serialVersionUID = 1L;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private transient SparkSession spark;

    private static final String JSON_FILE_PATH = "health_records.json";
    private static final ZoneId ZONE = ZoneId.systemDefault();
    private static final DateTimeFormatter MONTH_FMT =
            DateTimeFormatter.ofPattern("yyyy-MM").withZone(ZONE);
            
    @PostConstruct
    public void init() {
        try {
            // Use the same Spark session configuration as in RiskAssessmentService
            System.setProperty("spark.hadoop.fs.permissions.umask-mode", "022");
            System.setProperty("spark.hadoop.fs.defaultFS", "file:///");
            System.setProperty("spark.driver.extraJavaOptions", "-Djava.security.manager=allow");
            System.setProperty("spark.executor.extraJavaOptions", "-Djava.security.manager=allow");
            System.setProperty("spark.hadoop.hadoop.security.authentication", "simple");
            System.setProperty("spark.hadoop.hadoop.security.authorization", "false");
            
            spark = SparkSession.builder()
                    .appName("HealthcareAnalytics")
                    .master("local[1]") // Use just one core to avoid conflicts with RiskAssessmentService
                    .config("spark.driver.host", "localhost")
                    .config("spark.ui.enabled", "false")
                    .getOrCreate();
        } catch (Exception e) {
            System.err.println("Error initializing Spark in AnalyticsService: " + e.getMessage());
        }
    }
    
    @PreDestroy
    public void cleanup() {
        // Note: We don't close the SparkSession here since it might be shared with RiskAssessmentService
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

        /* 4 ─ Build DTO */
        return new AnalyticsData(
                patientTimeline,
                allergyCounts,
                problemCounts,
                bySex
        );
    }

    /* ========== helpers =================================== */
    private static String toMonth(String iso) {
        try { return iso.substring(0,7); } catch (Exception e) { return "Unknown"; }
    }
}
