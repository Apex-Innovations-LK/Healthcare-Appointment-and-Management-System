package com.team06.appointment_service.service;

import java.util.*;

import com.team06.appointment_service.dto.AppointmentBookedDto;
import com.team06.appointment_service.dto.MakeAppointment;
import com.team06.appointment_service.dto.Notification1Dto;
import com.team06.appointment_service.dto.PatientDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.team06.appointment_service.model.Appointment;
import com.team06.appointment_service.repo.AppointmentRepo;

@Service
public class AppointmentService {

    @Autowired
    AppointmentRepo appointmentRepo;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    public List<Object> findSlots() {
        return appointmentRepo.findAvailableSlotsForCurrentWeek();
    }

    public void makeAppointment(MakeAppointment appointment) {
        appointmentRepo.updateAppointment(appointment.getAppointment_type(), appointment.getPatient_id(),appointment.getSlotId());
        AppointmentBookedDto appointmentBookedDto = new AppointmentBookedDto("booked",appointment.getSlotId());
        kafkaProducerService.sendAppointmentBookedEvent(appointmentBookedDto);
    }

    public ResponseEntity<Map<String, String>> getPatientId(UUID slotId) {
        PatientDto patientId = appointmentRepo.findPatientBySlotId(slotId);
        if(patientId != null) {
            Map<String, String> map = new HashMap<>();
            map.put("patient_id", patientId.getPatient_id());
            map.put("appointment_type", patientId.getAppointmemt_type());
            return ResponseEntity.ok(map);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Patient not found"));
        }
    }
}