package com.team06.appointment_service.controller;

import com.team06.appointment_service.dto.BookingResponse;
import com.team06.appointment_service.dto.MakeAppointment;
import com.team06.appointment_service.model.Appointment;
import com.team06.appointment_service.model.Availibility;
import com.team06.appointment_service.service.AppointmentService;
// import com.springboot.healthcare.dto.DoctorDetails;
import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    @Autowired
    AppointmentService appointmentService;

    // @Autowired
    // private RestTemplate restTemplate;

    // private final String AUTH_SERVICE_URL =
    // "http://localhost:8081/api/auth/get-doctor-details/";

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

    @GetMapping("/view-appointments/{patientId}")
    public ResponseEntity<List<Appointment>> viewAppointments(@PathVariable UUID patientId) {
        try {
            List<Appointment> appointments = appointmentService.getAppointmentsByPatientId(patientId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/delete-appointment/{slotId}")
    public ResponseEntity<?> deleteAppointment(@PathVariable UUID slotId) {
        if (!appointmentService.existsById(slotId)) {
            return ResponseEntity.notFound().build();
        }
        appointmentService.deleteById(slotId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get-session/{sessionId}")
    public ResponseEntity<Availibility> getSessionDetails(@PathVariable UUID sessionId) {
        try {
            Availibility session = appointmentService.getSession(sessionId);
            if (session != null) {
                return ResponseEntity.ok(session);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
