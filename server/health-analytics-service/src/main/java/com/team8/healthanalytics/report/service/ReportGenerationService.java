package com.team8.healthanalytics.report.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team8.healthanalytics.report.dto.ReportData;
import com.team8.healthanalytics.report.dto.ReportRequest;
import com.opencsv.CSVWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct; // Updated import
import java.io.IOException;
import java.io.StringWriter;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportGenerationService {
    private static final Logger logger = LoggerFactory.getLogger(ReportGenerationService.class);

    @Autowired
    private ObjectMapper objectMapper;

    private List<Map<String, Object>> jsonData;

    private static final DateTimeFormatter DATE_TIME_FORMATTER = new DateTimeFormatterBuilder()
            .append(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
            .optionalStart()
            .appendOffset("+HH:MM", "+00:00")
            .optionalEnd()
            .optionalStart()
            .appendOffset("+HHMM", "+0000")
            .optionalEnd()
            .toFormatter();

    @PostConstruct
    private void init() {
        jsonData = loadJsonData();
    }

    private List<Map<String, Object>> loadJsonData() {
        try {
            ClassPathResource resource = new ClassPathResource("health_data.json");
            logger.info("Loading health data from JSON file");
            return objectMapper.readValue(resource.getInputStream(), List.class);
        } catch (IOException e) {
            logger.error("Failed to load JSON data", e);
            throw new RuntimeException("Failed to load JSON data", e);
        }
    }

    public ReportData generateReport(ReportRequest request) {
        logger.info("Generating report for request: {}", request.getReportType());
        List<Map<String, Object>> filteredData = filterData(jsonData, request);
        Map<String, Object> summary = generateSummary(filteredData, request.getReportType());
        String title = generateTitle(request);
        return new ReportData(title, filteredData, summary);
    }

    private List<Map<String, Object>> filterData(List<Map<String, Object>> data, ReportRequest request) {
        LocalDate start = request.getStartDate() != null ? LocalDate.parse(request.getStartDate()) : LocalDate.MIN;
        LocalDate end = request.getEndDate() != null ? LocalDate.parse(request.getEndDate()) : LocalDate.MAX;
        String patientType = request.getPatientType() != null ? request.getPatientType().toLowerCase() : null;
        String patientSex = request.getPatientSex() != null ? request.getPatientSex() : null;
        String ageRange = request.getAgeRange() != null ? request.getAgeRange() : null;
        String city = request.getCity() != null ? request.getCity() : null;
        String state = request.getState() != null ? request.getState() : null;
        List<String> allergies = request.getAllergies() != null ? request.getAllergies() : null;
        List<String> medications = request.getMedications() != null ? request.getMedications() : null;

        return data.stream().filter(record -> {
            // Date filter
            String dateStr = (String) record.get("date_of_service");
            LocalDate recordDate = OffsetDateTime.parse(dateStr, DATE_TIME_FORMATTER).toLocalDate();
            boolean dateInRange = !recordDate.isBefore(start) && !recordDate.isAfter(end);

            // Patient type (problem_list) filter
            List<String> problemList = (List<String>) record.get("problem_list");
            boolean typeMatch = patientType == null ||
                    (problemList != null && problemList.stream().anyMatch(p -> p.toLowerCase().contains(patientType)));

            // Sex filter
            String sex = (String) record.get("patient_sex");
            boolean sexMatch = patientSex == null || patientSex.equals(sex);

            // Age range filter
            boolean ageMatch = true;
            if (ageRange != null) {
                LocalDate dob = LocalDate.parse((String) record.get("patient_dob"));
                int age = Period.between(dob, LocalDate.now()).getYears();
                switch (ageRange) {
                    case "0-30":
                        ageMatch = age <= 30;
                        break;
                    case "30-60":
                        ageMatch = age > 30 && age <= 60;
                        break;
                    case "60+":
                        ageMatch = age > 60;
                        break;
                    default:
                        ageMatch = false;
                }
            }

            // City filter
            String recordCity = (String) record.get("city");
            boolean cityMatch = city == null || city.equals(recordCity);

            // State filter
            String recordState = (String) record.get("state");
            boolean stateMatch = state == null || state.equals(recordState);

            // Allergies filter
            List<String> recordAllergies = (List<String>) record.get("allergies");
            boolean allergyMatch = allergies == null ||
                    (recordAllergies != null && recordAllergies.stream().anyMatch(a -> allergies.contains(a)));

            // Medications filter
            List<String> recordMedications = (List<String>) record.get("medications");
            boolean medicationMatch = medications == null ||
                    (recordMedications != null && recordMedications.stream().anyMatch(m -> medications.contains(m)));

            return dateInRange && typeMatch && sexMatch && ageMatch && cityMatch && stateMatch && allergyMatch && medicationMatch;
        }).map(this::cleanData).collect(Collectors.toList());
    }

    private Map<String, Object> cleanData(Map<String, Object> record) {
        Map<String, Object> cleaned = new HashMap<>(record);
        cleaned.put("date_of_service", OffsetDateTime.parse((String) cleaned.get("date_of_service"), DATE_TIME_FORMATTER).toLocalDate().toString());
        return cleaned;
    }

    private Map<String, Object> generateSummary(List<Map<String, Object>> data, String reportType) {
        Map<String, Object> summary = new HashMap<>();
        switch (reportType) {
            case "patient_visits":
                summary.put("total_visits", data.size());
                summary.put("unique_patients", data.stream().map(r -> r.get("patient_id")).distinct().count());
                summary.put("top_complaints", data.stream()
                        .flatMap(r -> ((List<String>) r.get("chief_complaint")).stream())
                        .collect(Collectors.groupingBy(c -> c, Collectors.counting()))
                        .entrySet().stream()
                        .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                        .limit(3)
                        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)));
                summary.put("sex_distribution", data.stream()
                        .collect(Collectors.groupingBy(r -> (String) r.get("patient_sex"), Collectors.counting())));
                summary.put("age_distribution", data.stream()
                        .collect(Collectors.groupingBy(r -> {
                            LocalDate dob = LocalDate.parse((String) r.get("patient_dob"));
                            int age = Period.between(dob, LocalDate.now()).getYears();
                            return age <= 30 ? "0-30" : age <= 60 ? "30-60" : "60+";
                        }, Collectors.counting())));
                break;
            case "diagnosis_summary":
                Map<String, Long> diagnosisCount = data.stream()
                        .flatMap(r -> ((List<String>) r.get("problem_list")).stream())
                        .collect(Collectors.groupingBy(d -> d, Collectors.counting()));
                summary.put("diagnosis_distribution", diagnosisCount);
                summary.put("total_patients", data.stream().map(r -> r.get("patient_id")).distinct().count());
                summary.put("top_medications", data.stream()
                        .flatMap(r -> ((List<String>) r.get("medications")).stream())
                        .collect(Collectors.groupingBy(m -> m, Collectors.counting()))
                        .entrySet().stream()
                        .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                        .limit(3)
                        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)));
                break;
            case "demographic_summary":
                summary.put("total_patients", data.stream().map(r -> r.get("patient_id")).distinct().count());
                summary.put("city_distribution", data.stream()
                        .collect(Collectors.groupingBy(r -> (String) r.get("city"), Collectors.counting())));
                summary.put("state_distribution", data.stream()
                        .collect(Collectors.groupingBy(r -> (String) r.get("state"), Collectors.counting())));
                summary.put("sex_distribution", data.stream()
                        .collect(Collectors.groupingBy(r -> (String) r.get("patient_sex"), Collectors.counting())));
                summary.put("age_distribution", data.stream()
                        .collect(Collectors.groupingBy(r -> {
                            LocalDate dob = LocalDate.parse((String) r.get("patient_dob"));
                            int age = Period.between(dob, LocalDate.now()).getYears();
                            return age <= 30 ? "0-30" : age <= 60 ? "30-60" : "60+";
                        }, Collectors.counting())));
                break;
        }
        return summary;
    }

    private String generateTitle(ReportRequest request) {
        String base = request.getReportType().replace("_", " ").toUpperCase();
        String dateRange = request.getStartDate() != null ? request.getStartDate() + " to " + request.getEndDate() : "All Time";
        String filters = new ArrayList<String>() {{
            if (request.getPatientType() != null) add("Condition: " + request.getPatientType());
            if (request.getPatientSex() != null) add("Sex: " + request.getPatientSex());
            if (request.getAgeRange() != null) add("Age: " + request.getAgeRange());
            if (request.getCity() != null) add("City: " + request.getCity());
            if (request.getState() != null) add("State: " + request.getState());
            if (request.getAllergies() != null) add("Allergies: " + String.join(",", request.getAllergies()));
            if (request.getMedications() != null) add("Medications: " + String.join(",", request.getMedications()));
        }}.stream().collect(Collectors.joining(", "));
        return String.format("%s Report (%s%s)", base, dateRange, filters.isEmpty() ? "" : ", " + filters);
    }

    public String generateCsv(ReportData reportData, String reportType) {
        StringWriter stringWriter = new StringWriter();
        try (CSVWriter csvWriter = new CSVWriter(stringWriter)) {
            List<String> headers = getCsvHeaders(reportType);
            csvWriter.writeNext(headers.toArray(new String[0]));
            for (Map<String, Object> row : reportData.getData()) {
                List<String> rowData = headers.stream().map(h -> {
                    Object value = row.get(h);
                    if (value instanceof List) {
                        return ((List<?>) value).stream().map(Object::toString).collect(Collectors.joining(";"));
                    }
                    return value != null ? value.toString() : "";
                }).collect(Collectors.toList());
                csvWriter.writeNext(rowData.toArray(new String[0]));
            }
        } catch (IOException e) {
            logger.error("Failed to generate CSV", e);
            throw new RuntimeException("Failed to generate CSV", e);
        }
        return stringWriter.toString();
    }

    private List<String> getCsvHeaders(String reportType) {
        switch (reportType) {
            case "patient_visits":
                return Arrays.asList("record_id", "patient_id", "patient_name", "date_of_service", "chief_complaint", "problem_list", "patient_sex", "city");
            case "diagnosis_summary":
                return Arrays.asList("record_id", "patient_id", "patient_name", "problem_list", "medications");
            case "demographic_summary":
                return Arrays.asList("patient_id", "patient_name", "patient_sex", "patient_dob", "city", "state");
            default:
                return Arrays.asList("record_id", "patient_id", "patient_name", "date_of_service", "chief_complaint", "problem_list");
        }
    }
}