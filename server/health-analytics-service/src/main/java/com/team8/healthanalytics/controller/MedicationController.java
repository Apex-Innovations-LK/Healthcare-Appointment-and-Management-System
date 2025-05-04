package com.team8.healthanalytics.controller;

import com.team8.healthanalytics.model.DrugInteraction;
import com.team8.healthanalytics.service.InteractionChecker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/medication")
public class MedicationController {

    @Autowired
    private InteractionChecker checker;

    @PostMapping("/check")
    public List<DrugInteraction> check(@RequestBody List<String> medications) {
        return checker.checkInteractions(medications);
    }
}