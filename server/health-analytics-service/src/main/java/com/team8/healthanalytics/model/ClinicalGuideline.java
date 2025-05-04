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
}