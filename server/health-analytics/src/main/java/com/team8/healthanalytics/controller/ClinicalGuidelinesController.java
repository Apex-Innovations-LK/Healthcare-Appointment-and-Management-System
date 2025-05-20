package com.team8.healthanalytics.controller;

import com.team8.healthanalytics.model.ClinicalGuideline;
import com.team8.healthanalytics.model.ClinicalRecommendation;
import com.team8.healthanalytics.model.PatientRecord;
import com.team8.healthanalytics.service.ClinicalGuidelinesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics/guidelines")
public class ClinicalGuidelinesController {
    @Autowired
    private ClinicalGuidelinesService guidelinesService;

    @GetMapping("/evaluate-all")
    public ResponseEntity<Map<String, List<ClinicalRecommendation>>> evaluateAllPatients() {
        return ResponseEntity.ok(guidelinesService.evaluateAllPatients());
    }

    @PostMapping("/evaluate")
    public ResponseEntity<List<ClinicalRecommendation>> evaluatePatient(@RequestBody PatientRecord patientData) {
        return ResponseEntity.ok(guidelinesService.evaluatePatient(patientData));
    }

    @GetMapping("/{condition}")
    public ResponseEntity<List<ClinicalRecommendation>> getGuidelinesByCondition(@PathVariable String condition) {
        return ResponseEntity.ok(guidelinesService.getGuidelinesByCondition(condition));
    }

    @GetMapping("/patient/{id}")
    public ResponseEntity<List<ClinicalRecommendation>> evaluateByPatientId(@PathVariable String id) {
        return guidelinesService.getPatientById(id)
                .map(patient -> ResponseEntity.ok(guidelinesService.evaluatePatient(patient)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/raw/patients")
    public ResponseEntity<List<PatientRecord>> getAllPatients() {
        return ResponseEntity.ok(guidelinesService.getAllPatients());
    }

    @GetMapping("/raw/guidelines")
    public ResponseEntity<List<ClinicalGuideline>> getAllGuidelines() {
        return ResponseEntity.ok(guidelinesService.getAllGuidelines());
    }
}