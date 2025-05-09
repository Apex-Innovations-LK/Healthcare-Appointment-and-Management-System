package com.team06.appointment_service.controller;

import com.team06.appointment_service.dto.BookingResponse;
import com.team06.appointment_service.dto.MakeAppointment;
import com.team06.appointment_service.model.Appointment;
import com.team06.appointment_service.service.AppointmentService;
import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    @Autowired
    AppointmentService appointmentService;

    @GetMapping("/get-slots")
    public List<Object> findSlots() {
        List<Object> list = appointmentService.findSlots();
        System.out.println("list: " + list);
        return list;
    }

    @PostMapping("/book-appointment")
    public ResponseEntity<Map<String, String>> bookAppointment(@RequestBody MakeAppointment appointment) {
        Map<String, String> response = new HashMap<>();
        try {
            appointmentService.makeAppointment(appointment);
            response.put("message", "Successfully Reserved!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}
