package com.team8.healthanalytics.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.team8.healthanalytics.model.ClinicalGuideline;
import com.team8.healthanalytics.model.ClinicalRecommendation;
import com.team8.healthanalytics.model.PatientRecord;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ClinicalGuidelinesService {

    private static final Logger logger = LoggerFactory.getLogger(ClinicalGuidelinesService.class);

    @Autowired
    private ResourceLoader resourceLoader;

    private List<ClinicalGuideline> guidelines;
    private List<PatientRecord> patients;

    @PostConstruct
    public void init() {
        try {
            ObjectMapper mapper = new ObjectMapper();

            Resource guidelinesResource = resourceLoader.getResource("classpath:clinical_guidelines.json");
            if (!guidelinesResource.exists()) {
                throw new IOException("clinical_guidelines.json not found in resources");
            }
            guidelines = mapper.readValue(guidelinesResource.getInputStream(), new TypeReference<>() {});
            logger.info("Loaded {} clinical guidelines from JSON", guidelines.size());

            Resource patientsResource = resourceLoader.getResource("classpath:health_records.json");
            if (!patientsResource.exists()) {
                throw new IOException("health_records.json not found in resources");
            }
            patients = mapper.readValue(patientsResource.getInputStream(), new TypeReference<>() {});
            logger.info("Loaded {} patient records from JSON", patients.size());

        } catch (IOException e) {
            logger.error("Failed to load JSON files: {}", e.getMessage());
            throw new RuntimeException("Failed to load JSON files", e);
        }
    }

    public Map<String, List<ClinicalRecommendation>> evaluateAllPatients() {
        return patients.stream().collect(Collectors.toMap(
                PatientRecord::getPatientId,
                this::evaluatePatient
        ));
    }

    public List<ClinicalRecommendation> evaluatePatient(PatientRecord patientData) {
        logger.info("Evaluating guidelines for patient: {}", patientData);

        return guidelines.stream()
                .filter(g -> evaluateRule(g.getRule(), patientData))
                .sorted(Comparator.comparingInt(ClinicalGuideline::getPriority)) // priority sorting
                .map(g -> new ClinicalRecommendation(g.getCondition(), g.getRecommendation(), g.getSource()))
                .collect(Collectors.toList());
    }

    public List<ClinicalRecommendation> getGuidelinesByCondition(String condition) {
        logger.info("Retrieving guidelines for condition: {}", condition);
        return guidelines.stream()
                .filter(g -> g.getCondition().equalsIgnoreCase(condition))
                .sorted(Comparator.comparingInt(ClinicalGuideline::getPriority))
                .map(g -> new ClinicalRecommendation(g.getCondition(), g.getRecommendation(), g.getSource()))
                .collect(Collectors.toList());
    }

    public Optional<PatientRecord> getPatientById(String patientId) {
        return patients.stream()
                .filter(p -> p.getPatientId().equalsIgnoreCase(patientId))
                .findFirst();
    }

    public List<ClinicalGuideline> getAllGuidelines() {
        return guidelines;
    }

    public List<PatientRecord> getAllPatients() {
        return patients;
    }

    private boolean evaluateRule(Map<String, Object> rule, PatientRecord patientData) {
        boolean matches = true;

        // Match condition from problem list
        if (rule.containsKey("condition")) {
            Object val = rule.get("condition");
            if (val instanceof List<?>) {
                List<?> conditions = (List<?>) val;
                matches &= patientData.getProblemList().stream()
                        .anyMatch(p -> conditions.stream()
                                .anyMatch(c -> p.equalsIgnoreCase(c.toString())));
            } else if (val instanceof String) {
                matches &= patientData.getProblemList().stream()
                        .anyMatch(p -> p.equalsIgnoreCase((String) val));
            }
        }

        // Match blood pressure
        if (rule.containsKey("bp_systolic") && rule.containsKey("bp_diastolic")) {
            Optional<String> bpEntry = patientData.getLbfData().stream()
                    .filter(l -> l.startsWith("LBF103"))
                    .findFirst();

            if (bpEntry.isPresent()) {
                String[] values = bpEntry.get().split(":")[1].split("/");
                try {
                    int systolic = Integer.parseInt(values[0].trim());
                    int diastolic = Integer.parseInt(values[1].trim());

                    String sysCond = rule.get("bp_systolic").toString();
                    String diaCond = rule.get("bp_diastolic").toString();

                    if (sysCond.startsWith(">")) {
                        int threshold = Integer.parseInt(sysCond.substring(1));
                        matches &= systolic > threshold;
                    }
                    if (diaCond.startsWith(">")) {
                        int threshold = Integer.parseInt(diaCond.substring(1));
                        matches &= diastolic > threshold;
                    }
                } catch (Exception e) {
                    logger.warn("Invalid BP format in LBF103: {}", bpEntry.get());
                    return false;
                }
            }
        }

        // Match chief complaint
        if (rule.containsKey("chief_complaint")) {
            Object val = rule.get("chief_complaint");
            if (val instanceof List<?>) {
                List<?> complaints = (List<?>) val;
                matches &= patientData.getChiefComplaint().stream()
                        .anyMatch(c -> complaints.stream()
                                .anyMatch(comp -> c.equalsIgnoreCase(comp.toString())));
            } else if (val instanceof String) {
                matches &= patientData.getChiefComplaint().stream()
                        .anyMatch(c -> c.equalsIgnoreCase((String) val));
            }
        }

        // Match lab values like LBF102, LBF105, etc.
        for (String key : rule.keySet()) {
            if (key.startsWith("LBF")) {
                Optional<String> lab = patientData.getLbfData().stream()
                        .filter(l -> l.startsWith(key))
                        .findFirst();

                if (lab.isPresent()) {
                    try {
                        double value = Double.parseDouble(lab.get().split(":")[1].trim());
                        String condition = rule.get(key).toString();
                        if (condition.startsWith("<")) {
                            double threshold = Double.parseDouble(condition.substring(1));
                            matches &= value < threshold;
                        } else if (condition.startsWith(">")) {
                            double threshold = Double.parseDouble(condition.substring(1));
                            matches &= value > threshold;
                        }
                    } catch (Exception e) {
                        logger.warn("Error parsing lab field {}: {}", key, lab.get());
                        return false;
                    }
                }
            }
        }

        // Debug log for rule evaluation
        logger.debug("Rule evaluation result for rule {} against patient {}: {}", 
                    rule, patientData.getPatientId(), matches);

        return matches;
    }

}