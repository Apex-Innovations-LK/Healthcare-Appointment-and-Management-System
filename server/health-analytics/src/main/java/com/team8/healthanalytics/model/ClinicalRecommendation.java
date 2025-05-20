package com.team8.healthanalytics.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ClinicalRecommendation {
    private String condition;
    private String recommendation;
    private String source;
    
    // Explicit constructor to match what's being used in the service
    public ClinicalRecommendation(String condition, String recommendation, String source) {
        this.condition = condition;
        this.recommendation = recommendation;
        this.source = source;
    }
}
