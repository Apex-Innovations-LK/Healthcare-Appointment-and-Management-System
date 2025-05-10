package com.team8.healthanalytics.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team8.healthanalytics.dto.AnalyticsData;
import com.team8.healthanalytics.model.HealthRecord;
import org.apache.spark.sql.SparkSession;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AnalyticsServiceTest {

    private AnalyticsService analyticsService;
    
    @Mock
    private ObjectMapper objectMapper;
    
    private SparkSession sparkSession;
    private AutoCloseable closeable;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
        
        // Create a local Spark session for testing with UI disabled
        sparkSession = SparkSession.builder()
                .appName("AnalyticsServiceTest")
                .master("local[1]")
                .config("spark.ui.enabled", "false")
                .getOrCreate();
        
        analyticsService = new AnalyticsService(objectMapper, sparkSession);
    }

    @AfterEach
    void tearDown() throws Exception {
        closeable.close();
        if (sparkSession != null) {
            sparkSession.stop();
        }
    }

    @Test
    void fetchAnalytics_WithValidData_ReturnsCorrectAnalytics() throws IOException {
        // Arrange
        HealthRecord record1 = new HealthRecord();
        record1.setPatientId("P1");
        record1.setDateOfService("2025-01-15");
        record1.setPatientSex("M");
        record1.setAllergies(Arrays.asList("Peanuts", "Penicillin"));
        record1.setProblemList(Arrays.asList("Hypertension", "Diabetes"));

        HealthRecord record2 = new HealthRecord();
        record2.setPatientId("P2");
        record2.setDateOfService("2025-01-20");
        record2.setPatientSex("F");
        record2.setAllergies(Arrays.asList("Latex", "Penicillin"));
        record2.setProblemList(Arrays.asList("Asthma", "Migraine"));

        HealthRecord[] mockRecords = new HealthRecord[]{record1, record2};

        when(objectMapper.readValue(any(InputStream.class), eq(HealthRecord[].class)))
                .thenReturn(mockRecords);

        // Act
        AnalyticsData result = analyticsService.fetchAnalytics();

        // Assert
        assertNotNull(result);
        
        // Verify timeline data
        List<AnalyticsData.Point> timeline = result.getPatientCountTimeline();
        assertFalse(timeline.isEmpty());
        assertEquals("2025-01", timeline.get(0).getDate());
        assertEquals(2, timeline.get(0).getCount());

        // Verify allergy counts
        Map<String, Integer> allergyCounts = result.getAllergiesDistribution();
        assertEquals(3, allergyCounts.size());
        assertEquals(1, allergyCounts.get("Peanuts"));
        assertEquals(2, allergyCounts.get("Penicillin"));
        assertEquals(1, allergyCounts.get("Latex"));

        // Verify problem counts
        Map<String, Integer> problemCounts = result.getProblemListCounts();
        assertEquals(4, problemCounts.size());
        assertEquals(1, problemCounts.get("Hypertension"));
        assertEquals(1, problemCounts.get("Diabetes"));
        assertEquals(1, problemCounts.get("Asthma"));
        assertEquals(1, problemCounts.get("Migraine"));

        // Verify problems by sex
        Map<String, Map<String, Integer>> problemsBySex = result.getProblemListBySex();
        assertEquals(2, problemsBySex.size());
        assertTrue(problemsBySex.containsKey("M"));
        assertTrue(problemsBySex.containsKey("F"));
        assertEquals(1, problemsBySex.get("M").get("Hypertension"));
        assertEquals(1, problemsBySex.get("F").get("Asthma"));
    }

    @Test
    void fetchAnalytics_WithIOException_ReturnsEmptyData() throws IOException {
        // Arrange
        when(objectMapper.readValue(any(InputStream.class), eq(HealthRecord[].class)))
                .thenThrow(new IOException("Test exception"));

        // Act
        AnalyticsData result = analyticsService.fetchAnalytics();

        // Assert
        assertNotNull(result);
        assertTrue(result.getPatientCountTimeline().isEmpty());
        assertTrue(result.getAllergiesDistribution().isEmpty());
        assertTrue(result.getProblemListCounts().isEmpty());
        assertTrue(result.getProblemListBySex().isEmpty());
    }
}
