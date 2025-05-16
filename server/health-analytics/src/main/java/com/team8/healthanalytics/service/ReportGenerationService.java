package com.team8.healthanalytics.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team8.healthanalytics.dto.ReportData;
import com.team8.healthanalytics.dto.ReportRequest;
import com.opencsv.CSVWriter;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.sql.types.DataTypes;
import org.apache.spark.sql.types.StructField;
import org.apache.spark.sql.types.StructType;
import static org.apache.spark.sql.functions.*;
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

    @Autowired
    private SparkSession sparkSession;

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
        logger.info("Initialized ReportGenerationService with {} records", jsonData.size());
    }

    private List<Map<String, Object>> loadJsonData() {
        try {
            ClassPathResource resource = new ClassPathResource("health_records.json");
            logger.info("Loading health data from JSON file");
            return objectMapper.readValue(resource.getInputStream(), List.class);
        } catch (IOException e) {
            logger.error("Failed to load JSON data", e);
            throw new RuntimeException("Failed to load JSON data", e);
        }
    }

    // Convert JSON data to Spark DataFrame
    private Dataset<Row> convertToDataFrame(List<Map<String, Object>> data) {
        // Create schema based on the first record
        if (data.isEmpty()) {
            return sparkSession.emptyDataFrame();
        }
        
        Map<String, Object> firstRecord = data.get(0);
        List<StructField> fields = new ArrayList<>();
        
        for (Map.Entry<String, Object> entry : firstRecord.entrySet()) {
            String fieldName = entry.getKey();
            Object value = entry.getValue();
            
            if (value instanceof String) {
                fields.add(DataTypes.createStructField(fieldName, DataTypes.StringType, true));
            } else if (value instanceof Number) {
                fields.add(DataTypes.createStructField(fieldName, DataTypes.DoubleType, true));
            } else if (value instanceof Boolean) {
                fields.add(DataTypes.createStructField(fieldName, DataTypes.BooleanType, true));
            } else if (value instanceof List) {
                // For lists, store as string with items separated by semicolons
                fields.add(DataTypes.createStructField(fieldName, DataTypes.StringType, true));
            } else {
                // Default to string for other types
                fields.add(DataTypes.createStructField(fieldName, DataTypes.StringType, true));
            }
        }
        
        StructType schema = DataTypes.createStructType(fields);
        
        // Convert data to rows
        List<Row> rows = new ArrayList<>();
        for (Map<String, Object> record : data) {
            Object[] values = new Object[fields.size()];
            for (int i = 0; i < fields.size(); i++) {
                String fieldName = fields.get(i).name();
                Object value = record.get(fieldName);
                
                if (value instanceof List) {
                    // Convert lists to strings with items separated by semicolons
                    values[i] = ((List<?>) value).stream()
                            .map(Object::toString)
                            .collect(Collectors.joining(";"));
                } else {
                    values[i] = value;
                }
            }
            rows.add(org.apache.spark.sql.RowFactory.create(values));
        }
        
        return sparkSession.createDataFrame(rows, schema);
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
        // Use Spark for all report types to improve performance
        switch (reportType) {
            case "demographic_summary":
                return generateDemographicSummaryWithSpark(data);
            case "patient_visits":
                return generatePatientVisitsSummaryWithSpark(data);
            case "diagnosis_summary":
                return generateDiagnosisSummaryWithSpark(data);
            default:
                // Fallback to original implementation for any unhandled report types
                return generateSummaryWithJavaStreams(data, reportType);
        }
    }
    
    /**
     * Fallback method that uses Java Streams for report types not yet implemented with Spark
     */
    private Map<String, Object> generateSummaryWithJavaStreams(List<Map<String, Object>> data, String reportType) {
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
    
    /**
     * Generates demographic summary using Apache Spark for improved performance with large datasets
     */
    private Map<String, Object> generateDemographicSummaryWithSpark(List<Map<String, Object>> data) {
        Map<String, Object> summary = new HashMap<>();
        
        // Convert data to Spark DataFrame
        Dataset<Row> df = convertToDataFrame(data);
        df.createOrReplaceTempView("health_records");
        
        // Register a UDF to calculate age groups
        sparkSession.udf().register("ageGroup", (String dob) -> {
            LocalDate birthDate = LocalDate.parse(dob);
            int age = Period.between(birthDate, LocalDate.now()).getYears();
            return age <= 30 ? "0-30" : age <= 60 ? "30-60" : "60+";
        }, DataTypes.StringType);
        
        // Total unique patients
        Long totalPatients = df.select("patient_id").distinct().count();
        summary.put("total_patients", totalPatients);
        
        // City distribution
        Dataset<Row> cityDistribution = df.groupBy("city")
                .count()
                .orderBy(col("count").desc());
        
        Map<String, Long> cityMap = new HashMap<>();
        cityDistribution.collectAsList().forEach(row -> 
            cityMap.put(row.getString(0), row.getLong(1))
        );
        summary.put("city_distribution", cityMap);
        
        // State distribution
        Dataset<Row> stateDistribution = df.groupBy("state")
                .count()
                .orderBy(col("count").desc());
        
        Map<String, Long> stateMap = new HashMap<>();
        stateDistribution.collectAsList().forEach(row -> 
            stateMap.put(row.getString(0), row.getLong(1))
        );
        summary.put("state_distribution", stateMap);
        
        // Sex distribution
        Dataset<Row> sexDistribution = df.groupBy("patient_sex")
                .count()
                .orderBy(col("count").desc());
        
        Map<String, Long> sexMap = new HashMap<>();
        sexDistribution.collectAsList().forEach(row -> 
            sexMap.put(row.getString(0), row.getLong(1))
        );
        summary.put("sex_distribution", sexMap);
        
        // Age distribution - using SQL for clarity
        Dataset<Row> ageDistribution = sparkSession.sql(
            "SELECT ageGroup(patient_dob) as age_group, COUNT(*) as count " +
            "FROM health_records " +
            "GROUP BY ageGroup(patient_dob) " +
            "ORDER BY count DESC"
        );
        
        Map<String, Long> ageMap = new HashMap<>();
        ageDistribution.collectAsList().forEach(row -> 
            ageMap.put(row.getString(0), row.getLong(1))
        );
        summary.put("age_distribution", ageMap);
        
        return summary;
    }
    
    /**
     * Generates patient visits summary using Apache Spark for improved performance with large datasets
     */
    private Map<String, Object> generatePatientVisitsSummaryWithSpark(List<Map<String, Object>> data) {
        Map<String, Object> summary = new HashMap<>();
        
        // Convert data to Spark DataFrame
        Dataset<Row> df = convertToDataFrame(data);
        df.createOrReplaceTempView("patient_visits");
        
        // Register UDF to calculate age groups
        sparkSession.udf().register("ageGroup", (String dob) -> {
            LocalDate birthDate = LocalDate.parse(dob);
            int age = Period.between(birthDate, LocalDate.now()).getYears();
            return age <= 30 ? "0-30" : age <= 60 ? "30-60" : "60+";
        }, DataTypes.StringType);
        
        // Total visits
        summary.put("total_visits", (long) data.size());
        
        // Unique patients
        Long uniquePatients = df.select("patient_id").distinct().count();
        summary.put("unique_patients", uniquePatients);
        
        // Top complaints - requires special handling for semicolon-separated values
        Dataset<Row> complaintsDF = sparkSession.sql(
            "SELECT explode(split(chief_complaint, ';')) as complaint FROM patient_visits"
        );
        complaintsDF.createOrReplaceTempView("complaints");
        
        Dataset<Row> topComplaints = sparkSession.sql(
            "SELECT complaint, COUNT(*) as count " +
            "FROM complaints " +
            "GROUP BY complaint " +
            "ORDER BY count DESC " +
            "LIMIT 3"
        );
        
        Map<String, Long> complaintsMap = new HashMap<>();
        topComplaints.collectAsList().forEach(row -> 
            complaintsMap.put(row.getString(0), row.getLong(1))
        );
        summary.put("top_complaints", complaintsMap);
        
        // Sex distribution
        Dataset<Row> sexDistribution = df.groupBy("patient_sex")
                .count()
                .orderBy(col("count").desc());
        
        Map<String, Long> sexMap = new HashMap<>();
        sexDistribution.collectAsList().forEach(row -> 
            sexMap.put(row.getString(0), row.getLong(1))
        );
        summary.put("sex_distribution", sexMap);
        
        // Age distribution using SQL
        Dataset<Row> ageDistribution = sparkSession.sql(
            "SELECT ageGroup(patient_dob) as age_group, COUNT(*) as count " +
            "FROM patient_visits " +
            "GROUP BY ageGroup(patient_dob) " +
            "ORDER BY count DESC"
        );
        
        Map<String, Long> ageMap = new HashMap<>();
        ageDistribution.collectAsList().forEach(row -> 
            ageMap.put(row.getString(0), row.getLong(1))
        );
        summary.put("age_distribution", ageMap);
        
        return summary;
    }
    
    /**
     * Generates diagnosis summary using Apache Spark for improved performance with large datasets
     */
    private Map<String, Object> generateDiagnosisSummaryWithSpark(List<Map<String, Object>> data) {
        Map<String, Object> summary = new HashMap<>();
        
        // Convert data to Spark DataFrame
        Dataset<Row> df = convertToDataFrame(data);
        df.createOrReplaceTempView("diagnosis_data");
        
        // Total unique patients
        Long totalPatients = df.select("patient_id").distinct().count();
        summary.put("total_patients", totalPatients);
        
        // Diagnosis distribution - handle semicolon-separated values
        Dataset<Row> diagnosisDF = sparkSession.sql(
            "SELECT explode(split(problem_list, ';')) as diagnosis FROM diagnosis_data"
        );
        diagnosisDF.createOrReplaceTempView("diagnoses");
        
        Dataset<Row> diagnosisDistribution = sparkSession.sql(
            "SELECT diagnosis, COUNT(*) as count " +
            "FROM diagnoses " +
            "GROUP BY diagnosis " +
            "ORDER BY count DESC"
        );
        
        Map<String, Long> diagnosisMap = new HashMap<>();
        diagnosisDistribution.collectAsList().forEach(row -> 
            diagnosisMap.put(row.getString(0), row.getLong(1))
        );
        summary.put("diagnosis_distribution", diagnosisMap);
        
        // Top medications - handle semicolon-separated values
        Dataset<Row> medicationsDF = sparkSession.sql(
            "SELECT explode(split(medications, ';')) as medication FROM diagnosis_data"
        );
        medicationsDF.createOrReplaceTempView("meds");
        
        Dataset<Row> topMedications = sparkSession.sql(
            "SELECT medication, COUNT(*) as count " +
            "FROM meds " +
            "GROUP BY medication " +
            "ORDER BY count DESC " +
            "LIMIT 3"
        );
        
        Map<String, Long> medicationsMap = new HashMap<>();
        topMedications.collectAsList().forEach(row -> 
            medicationsMap.put(row.getString(0), row.getLong(1))
        );
        summary.put("top_medications", medicationsMap);
        
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