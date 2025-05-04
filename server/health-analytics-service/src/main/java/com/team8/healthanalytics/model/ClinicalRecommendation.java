package com.team8.healthanalytics.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClinicalRecommendation {
    private String message;
    private String name;
    private String description;
}
