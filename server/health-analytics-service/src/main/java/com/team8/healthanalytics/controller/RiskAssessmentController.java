package com.team8.healthanalytics.controller;

import com.team8.healthanalytics.model.RiskAssessment;
import com.team8.healthanalytics.model.PatientRecord;
import com.team8.healthanalytics.service.RiskAssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@RestController
@RequestMapping("/api/risk-assessment")
public class RiskAssessmentController {
    @Autowired
    private RiskAssessmentService riskAssessmentService;

    @GetMapping
    public List<RiskAssessment> getAllRiskAssessments() {
        return riskAssessmentService.getAllRiskAssessments();
    }

    @GetMapping("/advanced/{patientId}")
    public RiskAssessment getAdvancedRiskAssessment(@PathVariable String patientId) {
        return riskAssessmentService.getAllPatientRecords().stream()
                .filter(r -> r.getPatientId().equals(patientId))
                .findFirst()
                .map(riskAssessmentService::assessRiskWithSciPy)
                .orElse(null);
    }

    @GetMapping("/patients")
    public List<PatientRecord> getAllPatients() {
        return riskAssessmentService.getAllPatientRecords();
    }
}
