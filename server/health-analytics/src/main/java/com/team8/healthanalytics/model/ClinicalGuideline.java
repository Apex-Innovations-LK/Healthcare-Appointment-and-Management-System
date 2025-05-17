package com.team8.healthanalytics.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClinicalGuideline {
    private String condition;
    private Map<String, Object> rule;
    private String recommendation;
    private String source;
    private Integer priority;
    
    // Adding explicit getter methods to resolve compilation errors
    public String getCondition() {
        return condition;
    }
    
    public Map<String, Object> getRule() {
        return rule;
    }
    
    public String getRecommendation() {
        return recommendation;
    }
    
    public String getSource() {
        return source;
    }
    
    public Integer getPriority() {
        return priority;
    }
}