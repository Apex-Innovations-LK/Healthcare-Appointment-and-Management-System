package com.team8.healthanalytics.dto;

import java.util.List;
import java.util.Map;

public class ReportData {
    private String title;
    private List<Map<String, Object>> data;
    private Map<String, Object> summary;

    public ReportData(String title, List<Map<String, Object>> data, Map<String, Object> summary) {
        this.title = title;
        this.data = data;
        this.summary = summary;
    }

    // Getters
    public String getTitle() { return title; }
    public List<Map<String, Object>> getData() { return data; }
    public Map<String, Object> getSummary() { return summary; }
}