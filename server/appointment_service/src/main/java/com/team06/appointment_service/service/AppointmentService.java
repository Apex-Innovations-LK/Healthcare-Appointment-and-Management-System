package com.team06.appointment_service.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.team06.appointment_service.dto.AppointmentBookedDto;
import com.team06.appointment_service.dto.MakeAppointment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.team06.appointment_service.model.Appointment;
import com.team06.appointment_service.repo.AppointmentRepo;
import com.team06.appointment_service.model.Availibility;
import com.team06.appointment_service.repo.AvailibilityRepo;

@Service
public class AppointmentService {

    @Autowired
    AppointmentRepo appointmentRepo;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @Autowired
    AvailibilityRepo availibilityRepo;

    public List<Object> findSlots() {
        return appointmentRepo.findAvailableSlotsForCurrentWeek();
    }

    public void makeAppointment(MakeAppointment appointment) {
        appointmentRepo.updateAppointment(appointment.getAppointment_type(), appointment.getPatient_id(),appointment.getSlotId());

        AppointmentBookedDto appointmentBookedDto = new AppointmentBookedDto("Booked",appointment.getSlotId());

        kafkaProducerService.sendAppointmentBookedEvent(appointmentBookedDto);
    }

    public List<Appointment> getAppointmentsByPatientId(UUID patientId) {
        return appointmentRepo.findByPatientId(patientId);
    }

    public boolean existsById(UUID slotId) {
        return appointmentRepo.existsById(slotId);
    }

    public void deleteById(UUID slotId) {
        appointmentRepo.deleteById(slotId);
    }

    public Availibility getSession(UUID sessionId) {
        return availibilityRepo.findById(sessionId).orElse(null);
    }
}