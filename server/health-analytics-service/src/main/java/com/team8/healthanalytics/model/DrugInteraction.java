package com.team8.healthanalytics.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DrugInteraction {
    private String drugA;
    private String drugB;
    private String severity;
    private String description;
}
