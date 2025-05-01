// package com.team6.appointment_service.service;

// import java.util.List;

// import org.springframework.stereotype.Service;

// import com.team6.appointment_service.model.Appointment;
// import com.team6.appointment_service.repo.AppointmentRepository;

// @Service
// public class AppointmentService {

//     private final AppointmentRepository appointmentRepository;

//     public AppointmentService(AppointmentRepository appointmentRepository) {
//         this.appointmentRepository = appointmentRepository;
//     }

//     public List<Appointment> getAppointmentsByUserId(Long userId) {
//         return appointmentRepository.findByUserId(userId);
//     }
// }