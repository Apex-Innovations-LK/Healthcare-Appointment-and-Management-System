package com.team06.appointment_service.controller;

import com.team06.appointment_service.dto.BookingResponse;
import com.team06.appointment_service.dto.MakeAppointment;
import com.team06.appointment_service.model.Appointment;
import com.team06.appointment_service.service.AppointmentService;
// import com.springboot.healthcare.dto.DoctorDetails;
import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

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

    @Autowired
    private RestTemplate restTemplate;

    private final String AUTH_SERVICE_URL = "http://localhost:8081/api/auth/get-doctor-details/";

    @GetMapping("/get-slots")
    public List<Object> findSlots() {
        return appointmentService.findSlots();
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

    // // Fetch doctor details by doctorId from the auth-service
    // @GetMapping("/get-doctor-details/{doctorId}")
    // public ResponseEntity<DoctorDetails> getDoctorDetails(@PathVariable UUID doctorId) {
    //     try {
    //         // Make a REST call to the auth-service to get doctor details
    //         DoctorDetails doctorDetails = restTemplate.getForObject(AUTH_SERVICE_URL + doctorId, DoctorDetails.class);

    //         if (doctorDetails != null) {
    //             return ResponseEntity.ok(doctorDetails);
    //         } else {
    //             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    //         }
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    //     }
    // }
}
