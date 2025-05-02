package com.team6.appointment_service.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository; // Add this import
import com.team6.appointment_service.model.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findAll();
}