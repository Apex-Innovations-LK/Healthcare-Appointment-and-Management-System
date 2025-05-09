package com.team8.healthanalytics.dto;

import lombok.Data;

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
 *  └──────────────────────────────────────────────────────┘
 */
@Data
public class AnalyticsData {

    private List<Point> patientCountTimeline;
    private Map<String,Integer> allergiesDistribution;
    private Map<String,Integer> problemListCounts;
    private Map<String,Map<String,Integer>> problemListBySex;

    // Default constructor
    public AnalyticsData() {
    }

    // All-args constructor
    public AnalyticsData(List<Point> patientCountTimeline,
                        Map<String,Integer> allergiesDistribution,
                        Map<String,Integer> problemListCounts,
                        Map<String,Map<String,Integer>> problemListBySex) {
        this.patientCountTimeline = patientCountTimeline;
        this.allergiesDistribution = allergiesDistribution;
        this.problemListCounts = problemListCounts;
        this.problemListBySex = problemListBySex;
    }

    @Data
    public static class Point {
        private String date;    // yyyy‑MM
        private Integer count;
        
        // Default constructor
        public Point() {
        }
        
        // All-args constructor
        public Point(String date, Integer count) {
            this.date = date;
            this.count = count;
        }
    }
}
