//package com.team06.serviceschedule.controller;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.team06.serviceschedule.dto.ScheduleDto;
//import com.team06.serviceschedule.service.SchedularService;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mock;
//import org.mockito.Mockito;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.util.*;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(SchedulerController.class)
//public class SchedulerControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Mock
//    private SchedularService schedularService;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @Test
//    void testRunScheduler() throws Exception {
//        Map<String, String> mockResponse = Map.of("message", "Scheduler completed successfully!");
//
//        Mockito.when(schedularService.runScheduler()).thenReturn(ResponseEntity.ok(mockResponse));
//
//        mockMvc.perform(get("/api/schedule/run"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.message").value("Scheduler completed successfully!"));
//    }
//
//    @Test
//    void testGetCount() throws Exception {
//        Map<String, Long> countMap = Map.of("doctorCount", 5L, "staffCount", 10L);
//
//        Mockito.when(schedularService.getCount()).thenReturn(countMap);
//
//        mockMvc.perform(get("/api/schedule/get-count"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.doctorCount").value(5))
//                .andExpect(jsonPath("$.staffCount").value(10));
//    }
//
////    @Test
////    void testGetSchedule() throws Exception {
////        UUID staffId = UUID.randomUUID();
//////        List<ScheduleDto> mockSchedule = List.of(
//////                new ScheduleDto()
//////        );
////
////        Mockito.when(schedularService.getSchedule(staffId)).thenReturn(mockSchedule);
////
////        Map<String, UUID> requestPayload = Map.of("staff_id", staffId);
////
////        mockMvc.perform(post("/api/schedule/get-schedule")
////                        .contentType(MediaType.APPLICATION_JSON)
////                        .content(objectMapper.writeValueAsString(requestPayload)))
////                .andExpect(status().isOk());
////    }
//}
