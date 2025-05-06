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

        AppointmentBookedDto appointmentBookedDto = new AppointmentBookedDto("Booked",appointment.getSlotId());

        kafkaProducerService.sendAppointmentBookedEvent(appointmentBookedDto);
    }
}