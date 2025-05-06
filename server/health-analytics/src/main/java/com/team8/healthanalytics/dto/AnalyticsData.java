package com.team8.healthanalytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * Single DTO consumed by the Angular dashboard.
 *
 *  ┌──────────────────────────────────────────────────────┐
 *  │  AnalyticsData                                       │
 *  │──────────────────────────────────────────────────────│
 *  │  patientCountTimeline  : List<Point>                 │ ← Line / Bar   │
 *  │  allergiesDistribution : Map<String,Integer>         │ ← Pie          │
 *  │  problemListCounts     : Map<String,Integer>         │ ← Bar / Polar  │
 *  │  problemListBySex      : Map<String,Map<String,Integer>>│ ← Radar   │
 *  │  riskCategoryCounts    : Map<String,Integer>         │ ← Polar‑Area   │
 *  └──────────────────────────────────────────────────────┘
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsData {

    private List<Point>                           patientCountTimeline;
    private Map<String,Integer>                   allergiesDistribution;
    private Map<String,Integer>                   problemListCounts;
    private Map<String,Map<String,Integer>>       problemListBySex;
    private Map<String,Integer>                   riskCategoryCounts;

    @Data @AllArgsConstructor
    public static class Point {
        private String  date;    // yyyy‑MM
        private Integer count;
    }
}
