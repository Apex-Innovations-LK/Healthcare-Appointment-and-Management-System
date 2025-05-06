package com.team8.healthanalytics.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.team8.healthanalytics.model.PatientRecord;
import com.team8.healthanalytics.model.RiskAssessment;
import org.springframework.stereotype.Service;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.Serializable;
import java.time.Instant;

@Service
public class RiskAssessmentService implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private List<PatientRecord> patientRecords = new ArrayList<>();
    private transient SparkSession spark;
    private transient JavaSparkContext jsc;
    
    // Cache for risk distribution data
    private Map<String, Long> distributionCache = null;
    private long cacheTimestamp = 0;
    private static final long CACHE_DURATION_MS = 1; // 10 minutes

    @PostConstruct
    public void init() {
        try {
            // Set Hadoop properties to avoid security manager issues in Java 21
            System.setProperty("spark.hadoop.fs.permissions.umask-mode", "022");
            System.setProperty("spark.hadoop.fs.defaultFS", "file:///");
            System.setProperty("spark.driver.extraJavaOptions", "-Djava.security.manager=allow");
            System.setProperty("spark.executor.extraJavaOptions", "-Djava.security.manager=allow");
            
            // Turn off security authentication for local development
            System.setProperty("spark.hadoop.hadoop.security.authentication", "simple");
            System.setProperty("spark.hadoop.hadoop.security.authorization", "false");
            
            // Initialize Spark session with Java 21 compatible config
            spark = SparkSession.builder()
                    .appName("HealthcareRiskAssessment")
                    .master("local[*]") // Use all available cores for local development
                    .config("spark.driver.memory", "2g")
                    .config("spark.driver.host", "localhost")
                    .config("spark.sql.session.timeZone", "UTC") 
                    .config("spark.ui.enabled", "false") // Disable Spark UI to avoid additional complexity
                    .getOrCreate();
            
            jsc = JavaSparkContext.fromSparkContext(spark.sparkContext());
            
            // Load data
            loadPatientData();
        } catch (Exception e) {
            System.err.println("Error initializing Spark: " + e.getMessage());
            e.printStackTrace();
            
            // Create a fallback implementation without Spark
            patientRecords = new ArrayList<>();
            loadPatientData();
        }
    }
    
    @PreDestroy
    public void cleanup() {
        if (spark != null) {
            spark.close();
        }
    }

    public void loadPatientData() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = getClass().getClassLoader().getResourceAsStream("health_records.json");
            patientRecords = mapper.readValue(is, new TypeReference<List<PatientRecord>>() {});
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<RiskAssessment> getAllRiskAssessments() {
        try {
            if (spark != null && jsc != null) {
                // Use Spark when available
                JavaRDD<PatientRecord> recordsRDD = jsc.parallelize(patientRecords);
                
                // Process in batches to improve performance
                int batchSize = 100; // Adjust based on memory availability
                
                // Collect the RDD to get all records
                List<PatientRecord> allRecords = recordsRDD.collect();
                List<RiskAssessment> allAssessments = new ArrayList<>();
                
                // Process records in batches
                for (int i = 0; i < allRecords.size(); i += batchSize) {
                    int endIndex = Math.min(i + batchSize, allRecords.size());
                    List<PatientRecord> batch = allRecords.subList(i, endIndex);
                    List<RiskAssessment> batchResults = assessRiskWithSciPyBatch(batch);
                    allAssessments.addAll(batchResults);
                }
                
                return allAssessments;
            }
        } catch (Exception e) {
            System.err.println("Error using Spark for risk assessments: " + e.getMessage());
            e.printStackTrace();
        }
        
        // Fallback to non-Spark implementation with batching
        List<RiskAssessment> allAssessments = new ArrayList<>();
        int batchSize = 100;
        
        for (int i = 0; i < patientRecords.size(); i += batchSize) {
            int endIndex = Math.min(i + batchSize, patientRecords.size());
            List<PatientRecord> batch = patientRecords.subList(i, endIndex);
            List<RiskAssessment> batchResults = assessRiskWithSciPyBatch(batch);
            allAssessments.addAll(batchResults);
        }
        
        return allAssessments;
    }

    public List<PatientRecord> getAllPatientRecords() {
        return patientRecords;
    }

    public RiskAssessment assessRisk(PatientRecord record) {
        // Extract metrics
        Map<String, Double> metrics = extractMetrics(record);
        double systolic = metrics.getOrDefault("systolic", 0.0);
        double diastolic = metrics.getOrDefault("diastolic", 0.0);
        
        // Simple rule: if blood pressure (LBF103) >= 140/90, risk is High
        String riskLevel = "Low";
        String reason = "Normal metrics";
        
        if (systolic >= 140 || diastolic >= 90) {
            riskLevel = "High";
            reason = "High blood pressure";
        }
        
        return new RiskAssessment(record.getPatientId(), riskLevel, reason);
    }

    private Map<String, Double> extractMetrics(PatientRecord record) {
        Map<String, Double> metrics = new HashMap<>();
        
        for (String lbf : record.getLbfData()) {
            if (lbf.startsWith("LBF101")) {
                String[] parts = lbf.split(":");
                if (parts.length == 2) {
                    try {
                        metrics.put("blood_glucose", Double.parseDouble(parts[1]));
                    } catch (NumberFormatException ignored) {}
                }
            } else if (lbf.startsWith("LBF102")) {
                String[] parts = lbf.split(":");
                if (parts.length == 2) {
                    try {
                        metrics.put("hemoglobin", Double.parseDouble(parts[1]));
                    } catch (NumberFormatException ignored) {}
                }
            } else if (lbf.startsWith("LBF103")) {
                String[] parts = lbf.split(":");
                if (parts.length == 2 && parts[1].contains("/")) {
                    String[] bp = parts[1].split("/");
                    try {
                        metrics.put("systolic", Double.parseDouble(bp[0]));
                        metrics.put("diastolic", Double.parseDouble(bp[1]));
                    } catch (NumberFormatException ignored) {}
                }
            }
        }
        
        return metrics;
    }

    public RiskAssessment assessRiskWithSciPy(PatientRecord record) {
        // Extract metrics for SciPy script
        Map<String, Double> metrics = extractMetrics(record);
        double bloodGlucose = metrics.getOrDefault("blood_glucose", 0.0);
        double hemoglobin = metrics.getOrDefault("hemoglobin", 0.0);
        double systolic = metrics.getOrDefault("systolic", 0.0);
        double diastolic = metrics.getOrDefault("diastolic", 0.0);
        
        try {
            ObjectMapper mapper = new ObjectMapper();
            String inputJson = mapper.writeValueAsString(Map.of(
                "blood_glucose", bloodGlucose,
                "hemoglobin", hemoglobin,
                "systolic", systolic,
                "diastolic", diastolic
            ));
            
            String scriptPath = "python/risk_assessment_scipy.py";
            ProcessBuilder pb = new ProcessBuilder("python3", scriptPath, inputJson);
            pb.redirectErrorStream(true);
            Process process = pb.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("[Python Output] " + line); // Debug print
                output.append(line);
            }
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                JsonNode result = mapper.readTree(output.toString());
                String risk = result.has("risk") ? result.get("risk").asText() : "Unknown";
                String reason = result.has("reason") ? result.get("reason").asText() : "No reason";
                double probability = result.has("risk_probability") ? result.get("risk_probability").asDouble() : 0.0;
                
                RiskAssessment assessment = new RiskAssessment(record.getPatientId(), risk, reason);
                assessment.setRiskProbability(probability);
                return assessment;
            } else {
                return new RiskAssessment(record.getPatientId(), "Unknown", "Python script error");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new RiskAssessment(record.getPatientId(), "Unknown", "Exception: " + e.getMessage());
        }
    }
    
    public List<RiskAssessment> getBatchRiskAssessment(List<String> patientIds) {
        // Filter records to only the requested patient IDs
        List<PatientRecord> filteredRecords = patientRecords.stream()
            .filter(r -> patientIds.contains(r.getPatientId()))
            .toList();
        
        if (filteredRecords.isEmpty()) {
            return new ArrayList<>();
        }
        
        try {
            if (spark != null && jsc != null) {
                // Use Spark when available, but still use batch processing
                JavaRDD<PatientRecord> recordsRDD = jsc.parallelize(filteredRecords);
                
                // Process in batches for better performance
                int batchSize = 100; // Adjust based on memory availability
                List<PatientRecord> allRecords = recordsRDD.collect();
                List<RiskAssessment> allAssessments = new ArrayList<>();
                
                // Process records in batches
                for (int i = 0; i < allRecords.size(); i += batchSize) {
                    int endIndex = Math.min(i + batchSize, allRecords.size());
                    List<PatientRecord> batch = allRecords.subList(i, endIndex);
                    List<RiskAssessment> batchResults = assessRiskWithSciPyBatch(batch);
                    allAssessments.addAll(batchResults);
                }
                
                return allAssessments;
            }
        } catch (Exception e) {
            System.err.println("Error using Spark for batch processing: " + e.getMessage());
            e.printStackTrace();
        }
        
        // Fallback to non-Spark implementation with batching
        List<RiskAssessment> allAssessments = new ArrayList<>();
        int batchSize = 100;
        
        for (int i = 0; i < filteredRecords.size(); i += batchSize) {
            int endIndex = Math.min(i + batchSize, filteredRecords.size());
            List<PatientRecord> batch = filteredRecords.subList(i, endIndex);
            List<RiskAssessment> batchResults = assessRiskWithSciPyBatch(batch);
            allAssessments.addAll(batchResults);
        }
        
        return allAssessments;
    }
    
    public synchronized Map<String, Long> getRiskDistribution() {
        long now = Instant.now().toEpochMilli();
        
        // Return cached data if it's still valid
        if (distributionCache != null && (now - cacheTimestamp < CACHE_DURATION_MS)) {
            System.out.println("Using cached risk distribution data");
            return distributionCache;
        }
        
        System.out.println("Calculating fresh risk distribution data");
        
        try {
            if (spark != null) {
                // Using Spark SQL for analytics when available
                Dataset<Row> recordsDF = spark.createDataFrame(
                    getAllRiskAssessments(), 
                    RiskAssessment.class
                );
                
                // Group by risk level and count
                Dataset<Row> distribution = recordsDF.groupBy("riskLevel")
                    .count()
                    .orderBy("riskLevel");
                    
                // Convert to Map for API response
                List<Row> rows = distribution.collectAsList();
                Map<String, Long> result = new HashMap<>();
                
                for (Row row : rows) {
                    result.put(row.getString(0), row.getLong(1));
                }
                
                // Cache the result
                distributionCache = result;
                cacheTimestamp = now;
                
                return result;
            }
        } catch (Exception e) {
            System.err.println("Error using Spark for risk distribution: " + e.getMessage());
            e.printStackTrace();
        }
        
        // Fallback to Java Streams implementation
        Map<String, Long> distributionMap = new HashMap<>();
        
        // Get all risk assessments and count by risk level
        getAllRiskAssessments().stream()
            .collect(java.util.stream.Collectors.groupingBy(
                RiskAssessment::getRiskLevel,
                java.util.stream.Collectors.counting()
            ))
            .forEach(distributionMap::put);
        
        // Cache the result
        distributionCache = distributionMap;
        cacheTimestamp = now;
            
        return distributionMap;
    }
    
    public void clearDistributionCache() {
        distributionCache = null;
    }

    public List<RiskAssessment> assessRiskWithSciPyBatch(List<PatientRecord> records) {
        if (records == null || records.isEmpty()) {
            return new ArrayList<>();
        }
        
        try {
            // Create a list of patient data for batch processing
            List<Map<String, Object>> batchData = new ArrayList<>();
            
            for (PatientRecord record : records) {
                Map<String, Double> metrics = extractMetrics(record);
                Map<String, Object> patientData = new HashMap<>();
                
                patientData.put("id", record.getPatientId());
                patientData.put("blood_glucose", metrics.getOrDefault("blood_glucose", 0.0));
                patientData.put("hemoglobin", metrics.getOrDefault("hemoglobin", 0.0));
                patientData.put("systolic", metrics.getOrDefault("systolic", 0.0));
                patientData.put("diastolic", metrics.getOrDefault("diastolic", 0.0));
                
                batchData.add(patientData);
            }
            
            // Convert the batch data to JSON
            ObjectMapper mapper = new ObjectMapper();
            String inputJson = mapper.writeValueAsString(batchData);
            
            // Call the Python script with the batch data
            String scriptPath = "python/risk_assessment_scipy.py";
            ProcessBuilder pb = new ProcessBuilder("python3", scriptPath, inputJson);
            pb.redirectErrorStream(true);
            Process process = pb.start();
            
            // Collect the output
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("[Python Batch Output] " + line);  // Debug print
                output.append(line);
            }
            
            int exitCode = process.waitFor();
            List<RiskAssessment> assessments = new ArrayList<>();
            
            if (exitCode == 0) {
                // Parse the batch results
                JsonNode resultsArray = mapper.readTree(output.toString());
                
                if (resultsArray.isArray()) {
                    for (int i = 0; i < resultsArray.size(); i++) {
                        JsonNode result = resultsArray.get(i);
                        String patientId = result.has("id") ? result.get("id").asText() : "unknown";
                        String risk = result.has("risk") ? result.get("risk").asText() : "Unknown";
                        String reason = result.has("reason") ? result.get("reason").asText() : "No reason";
                        double probability = result.has("risk_probability") ? result.get("risk_probability").asDouble() : 0.0;
                        
                        RiskAssessment assessment = new RiskAssessment(patientId, risk, reason);
                        assessment.setRiskProbability(probability);
                        assessments.add(assessment);
                    }
                } else {
                    System.err.println("Expected array result from Python batch processing");
                }
            } else {
                System.err.println("Python script error during batch processing: Exit code " + exitCode);
                // Fallback to individual processing on error
                return records.stream()
                    .map(this::assessRiskWithSciPy)
                    .toList();
            }
            
            return assessments;
            
        } catch (Exception e) {
            System.err.println("Exception during batch risk assessment: " + e.getMessage());
            e.printStackTrace();
            
            // Fallback to individual processing on exception
            return records.stream()
                .map(this::assessRiskWithSciPy)
                .toList();
        }
    }
}
