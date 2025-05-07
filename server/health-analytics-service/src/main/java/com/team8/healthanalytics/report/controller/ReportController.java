package com.team8.healthanalytics.report.controller;

import com.team8.healthanalytics.report.dto.ReportData;
import com.team8.healthanalytics.report.dto.ReportRequest;
import com.team8.healthanalytics.report.service.ReportGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.Period;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:4200")
@Validated
public class ReportController {
    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);

    @Autowired
    private ReportGenerationService reportService;

    @PostMapping("/generate")
    public ResponseEntity<ReportData> generateReport(@Valid @RequestBody ReportRequest request) {
        try {
            ReportData reportData = reportService.generateReport(request);
            return ResponseEntity.ok(reportData);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/export/csv")
    public ResponseEntity<Resource> exportCsv(@Valid @RequestBody ReportRequest request) {
        ReportData reportData = reportService.generateReport(request);
        String csvContent = reportService.generateCsv(reportData, request.getReportType());
        ByteArrayResource resource = new ByteArrayResource(csvContent.getBytes(StandardCharsets.UTF_8));

        // Sanitize filename to avoid special characters
        String sanitizedFilename = request.getReportType() + "_" +
                (request.getStartDate() != null ? request.getStartDate() : "all") + "_" +
                (request.getEndDate() != null ? request.getEndDate() : "all") + ".csv";
        sanitizedFilename = sanitizedFilename.replaceAll("[^a-zA-Z0-9_.-]", "_");

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + sanitizedFilename + "\"");
        headers.setContentType(MediaType.parseMediaType("text/csv"));

        logger.info("Response headers for CSV export: {}", headers);

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(csvContent.length())
                .body(resource);
    }

    @PostMapping("/visualization-data")
    public ResponseEntity<Map<String, Object>> getVisualizationData(@Valid @RequestBody ReportRequest request) {
        try {
            ReportData reportData = reportService.generateReport(request);
            Map<String, Object> vizData = new HashMap<>();

            // Visits by Month
            Map<String, Long> visitsByMonth = reportData.getData().stream()
                    .collect(Collectors.groupingBy(
                            r -> {
                                LocalDate date = LocalDate.parse((String) r.get("date_of_service"));
                                return date.getYear() + "-" + String.format("%02d", date.getMonthValue());
                            },
                            Collectors.counting()
                    ));
            vizData.put("visits_by_month_labels", visitsByMonth.keySet().stream().sorted().collect(Collectors.toList()));
            vizData.put("visits_by_month_values", visitsByMonth.entrySet().stream()
                    .sorted(Map.Entry.comparingByKey())
                    .map(Map.Entry::getValue)
                    .collect(Collectors.toList()));

            // Diagnosis Distribution
            Map<String, Long> diagnosisDist = reportData.getData().stream()
                    .flatMap(r -> ((List<String>) r.get("problem_list")).stream())
                    .collect(Collectors.groupingBy(d -> d, Collectors.counting()));
            vizData.put("diagnosis_labels", diagnosisDist.keySet().stream().sorted().collect(Collectors.toList()));
            vizData.put("diagnosis_values", diagnosisDist.entrySet().stream()
                    .sorted(Map.Entry.comparingByKey())
                    .map(Map.Entry::getValue)
                    .collect(Collectors.toList()));

            // Sex Distribution
            Map<String, Long> sexDist = reportData.getData().stream()
                    .collect(Collectors.groupingBy(r -> (String) r.get("patient_sex"), Collectors.counting()));
            vizData.put("sex_labels", sexDist.keySet().stream().sorted().collect(Collectors.toList()));
            vizData.put("sex_values", sexDist.values().stream().collect(Collectors.toList()));

            // Age Distribution
            Map<String, Long> ageDist = reportData.getData().stream()
                    .collect(Collectors.groupingBy(r -> {
                        LocalDate dob = LocalDate.parse((String) r.get("patient_dob"));
                        int age = Period.between(dob, LocalDate.now()).getYears();
                        return age <= 30 ? "0-30" : age <= 60 ? "30-60" : "60+";
                    }, Collectors.counting()));
            vizData.put("age_labels", ageDist.keySet().stream().sorted().collect(Collectors.toList()));
            vizData.put("age_values", ageDist.values().stream().collect(Collectors.toList()));

            // City Distribution
            Map<String, Long> cityDist = reportData.getData().stream()
                    .collect(Collectors.groupingBy(r -> (String) r.get("city"), Collectors.counting()));
            vizData.put("city_labels", cityDist.keySet().stream().sorted().collect(Collectors.toList()));
            vizData.put("city_values", cityDist.values().stream().collect(Collectors.toList()));

            vizData.put("summary", reportData.getSummary());
            return ResponseEntity.ok(vizData);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}