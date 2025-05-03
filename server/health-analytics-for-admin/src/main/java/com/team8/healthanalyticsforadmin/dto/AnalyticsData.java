package com.team8.healthanalyticsforadmin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * ───────────────────────────────────────────────────────────
 *  ┌──────────────────────────────────────────────────────┐
 *  │  AnalyticsData                                       │
 *  │──────────────────────────────────────────────────────│
 *  │  patientCountTimeline  : List<Point>                 │ ← line / bar
 *  │  allergiesDistribution : Map<String,Integer>         │ ← pie / doughnut
 *  │  problemListCounts     : Map<String,Integer>         │ ← bar / polar
 *  │  problemListBySex      : Map<String,Map<String,Integer>>│ ← radar/table
 *  └──────────────────────────────────────────────────────┘
 *  Point = { date : String (yyyy‑MM), count : Integer }
 * ───────────────────────────────────────────────────────────
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsData {

    /** How many distinct patients per month */
    private List<Point> patientCountTimeline;

    /** “Penicillin” → 42, “Peanuts” → 17 … */
    private Map<String, Integer> allergiesDistribution;

    /** “Diabetes” → 31, “Hypertension” → 64 … */
    private Map<String, Integer> problemListCounts;

    /**
     *  {
     *    "Male"   : { "Diabetes": 12, "Hypertension": 22 … },
     *    "Female" : { "Diabetes": 19, "Hypertension": 42 … }
     *  }
     */
    private Map<String, Map<String, Integer>> problemListBySex;

    /** Small helper record used by the timeline */
    @Data @AllArgsConstructor
    public static class Point {
        private String date;  // e.g. "2024‑11"
        private Integer count;
    }
}
