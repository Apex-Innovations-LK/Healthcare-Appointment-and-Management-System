package com.team8.healthanalytics.controller;

import com.team8.healthanalytics.model.RiskAssessment;
import com.team8.healthanalytics.model.PatientRecord;
import com.team8.healthanalytics.service.RiskAssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics/risk-assessment")
public class RiskAssessmentController {
    @Autowired
    private RiskAssessmentService riskAssessmentService;

    // Only use this endpoint when ALL assessments are needed - NOT for patient list
    @GetMapping
    public List<RiskAssessment> getAllRiskAssessments() {
        return riskAssessmentService.getAllRiskAssessments();
    }

    // Use this endpoint for individual patient risk assessment (when "Assess Risk" is clicked)
    @GetMapping("/{patientId}")
    public RiskAssessment getAdvancedRiskAssessment(@PathVariable String patientId) {
        return riskAssessmentService.getAllPatientRecords().stream()
                .filter(r -> r.getPatientId().equals(patientId))
                .findFirst()
                .map(riskAssessmentService::assessRiskWithSciPy)
                .orElse(null);
    }

    // Endpoint to get patients without calculating risks
    @GetMapping("/patients")
    public List<PatientRecord> getAllPatients() {
        return riskAssessmentService.getAllPatientRecords();
    }
    
    // Batch processing for multiple patients when needed
    @PostMapping("/batch")
    public List<RiskAssessment> getBatchRiskAssessments(@RequestBody List<String> patientIds) {
        return riskAssessmentService.getBatchRiskAssessment(patientIds);
    }
    
    // Optimized endpoint for risk distribution - uses cache internally
    @GetMapping("/distribution")
    public Map<String, Long> getRiskDistribution() {
        return riskAssessmentService.getRiskDistribution();
    }
}
