package com.team8.healthanalytics.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.team8.healthanalytics.model.ClinicalGuideline;
import com.team8.healthanalytics.model.ClinicalRecommendation;
import com.team8.healthanalytics.model.PatientData;
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
    private List<PatientData> patients;

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

            Resource patientsResource = resourceLoader.getResource("classpath:patientdata.json");
            if (!patientsResource.exists()) {
                throw new IOException("patientdata.json not found in resources");
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
                PatientData::getPatient_id,
                this::evaluatePatient
        ));
    }

    public List<ClinicalRecommendation> evaluatePatient(PatientData patientData) {
        logger.info("Evaluating guidelines for patient: {}", patientData.getPatient_id());

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

    public Optional<PatientData> getPatientById(String patientId) {
        return patients.stream()
                .filter(p -> p.getPatient_id().equalsIgnoreCase(patientId))
                .findFirst();
    }

    public List<ClinicalGuideline> getAllGuidelines() {
        return guidelines;
    }

    public List<PatientData> getAllPatients() {
        return patients;
    }

    private boolean evaluateRule(Map<String, Object> rule, PatientData patientData) {
        boolean matches = true;

        // Match condition from problem list
        if (rule.containsKey("condition")) {
            Object val = rule.get("condition");
            if (val instanceof List<?>) {
                List<?> conditions = (List<?>) val;
                matches &= patientData.getProblem_list().stream()
                        .anyMatch(p -> conditions.contains(p));
            } else if (val instanceof String) {
                matches &= patientData.getProblem_list().stream()
                        .anyMatch(p -> p.equalsIgnoreCase((String) val));
            }
        }

        // Match blood pressure
        if (rule.containsKey("bp_systolic") && rule.containsKey("bp_diastolic")) {
            Optional<String> bpEntry = patientData.getLbf_data().stream()
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
                matches &= patientData.getChief_complaint().stream()
                        .anyMatch(c -> complaints.contains(c));
            } else if (val instanceof String) {
                matches &= patientData.getChief_complaint().stream()
                        .anyMatch(c -> c.equalsIgnoreCase((String) val));
            }
        }

        // Match lab values like LBF102, LBF105, etc.
        for (String key : rule.keySet()) {
            if (key.startsWith("LBF")) {
                Optional<String> lab = patientData.getLbf_data().stream()
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

        return matches;
    }

}