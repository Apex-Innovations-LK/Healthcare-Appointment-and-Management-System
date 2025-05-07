package com.team8.healthanalytics.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team8.healthanalytics.dto.AnalyticsData;
import com.team8.healthanalytics.dto.AnalyticsData.Point;
import com.team8.healthanalytics.model.HealthRecord;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.apache.spark.sql.SparkSession;
import org.springframework.beans.factory.annotation.Autowired;

import jakarta.annotation.PreDestroy;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService implements Serializable {
    private static final long serialVersionUID = 1L;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private transient final SparkSession spark;

    private static final String JSON_FILE_PATH = "health_records.json";
    private static final ZoneId ZONE = ZoneId.systemDefault();
    private static final DateTimeFormatter MONTH_FMT =
            DateTimeFormatter.ofPattern("yyyy-MM").withZone(ZONE);
            
    // Constructor to replace @RequiredArgsConstructor
    @Autowired
    public AnalyticsService(RestTemplate restTemplate, ObjectMapper objectMapper, SparkSession sparkSession) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.spark = sparkSession;
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

        // Use Spark to process analytics
        org.apache.spark.sql.Dataset<org.apache.spark.sql.Row> df = spark.createDataFrame(records, HealthRecord.class);
        df.createOrReplaceTempView("records");

        // 1. Distinct-patient count per month
        org.apache.spark.sql.Dataset<org.apache.spark.sql.Row> perMonthDF = spark.sql(
                "SELECT substring(dateOfService, 1, 7) as month, COUNT(DISTINCT patientId) as count " +
                "FROM records WHERE dateOfService IS NOT NULL AND dateOfService != '' GROUP BY month ORDER BY month"
        );
        List<Point> patientTimeline = new ArrayList<>();
        for (org.apache.spark.sql.Row row : perMonthDF.collectAsList()) {
            String month = row.getAs("month");
            int count = ((Number) row.getAs("count")).intValue();
            patientTimeline.add(new Point(month, count));
        }

        // 2. Allergy distribution
        org.apache.spark.sql.Dataset<org.apache.spark.sql.Row> allergyDF = df.withColumn("allergy", org.apache.spark.sql.functions.explode(df.col("allergies")))
                .groupBy("allergy").count();
        Map<String, Integer> allergyCounts = new HashMap<>();
        for (org.apache.spark.sql.Row row : allergyDF.collectAsList()) {
            String allergy = row.getAs("allergy");
            int count = ((Number) row.getAs("count")).intValue();
            allergyCounts.put(allergy, count);
        }

        // 3. Problem statistics (overall)
        org.apache.spark.sql.Dataset<org.apache.spark.sql.Row> problemDF = df.withColumn("problem", org.apache.spark.sql.functions.explode(df.col("problemList")))
                .groupBy("problem").count();
        Map<String, Integer> problemCounts = new HashMap<>();
        for (org.apache.spark.sql.Row row : problemDF.collectAsList()) {
            String problem = row.getAs("problem");
            int count = ((Number) row.getAs("count")).intValue();
            problemCounts.put(problem, count);
        }

        // 4. Problem statistics by sex
        org.apache.spark.sql.Dataset<org.apache.spark.sql.Row> bySexDF = df.withColumn("problem", org.apache.spark.sql.functions.explode(df.col("problemList")))
                .groupBy("patientSex", "problem").count();
        Map<String, Map<String, Integer>> bySex = new HashMap<>();
        for (org.apache.spark.sql.Row row : bySexDF.collectAsList()) {
            String sex = row.getAs("patientSex") != null ? row.getAs("patientSex") : "Unknown";
            String problem = row.getAs("problem");
            int count = ((Number) row.getAs("count")).intValue();
            bySex.computeIfAbsent(sex, k -> new HashMap<>()).put(problem, count);
        }

        // Build DTO
        return new AnalyticsData(
                patientTimeline,
                allergyCounts,
                problemCounts,
                bySex
        );
    }
}
