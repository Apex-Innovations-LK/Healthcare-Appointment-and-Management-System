package com.team06.appointment_service.repo;

import com.team06.appointment_service.dto.MakeAppointment;
import com.team06.appointment_service.model.Appointment;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface AppointmentRepo extends JpaRepository<Appointment, UUID> {

    @Query(value = """
            SELECT
            a.slot_id,
            d.doctor_id,
            d."from",
            d."to"
            FROM
            appointmentservice.appointment a
            JOIN
            appointmentservice.availibility d
            ON
            a.session_id = d.session_id
            WHERE
            a.status = 'available'
            AND d."from" >= date_trunc('week', now())  + interval '7 days'
            AND d."from" < date_trunc('week', now()) + interval '14 days'
        """, nativeQuery = true)
    List<Object> findAvailableSlotsForCurrentWeek();


    @Modifying
    @Transactional
    @Query(value = """

            UPDATE appointmentservice.appointment 
        SET appointment_type = :appointment_type, status = 'booked', patient_id = :patient_id 
        WHERE slot_id = :slotId
        """, nativeQuery = true)
    void updateAppointment(@Param("appointment_type") String appointment_type,
                           @Param("patient_id") UUID patient_id,
                           @Param("slotId") UUID slotId);


    @Modifying
    @Transactional
    @Query(value = """
        UPDATE appointmentservice.appointment
        SET appointment.status = 'rejected'
        WHERE appointment.slot_id = :slotId
        """, nativeQuery = true)
    void updateAppointmentTable(@Param("slotId") UUID slotId);


    @Query("SELECT a FROM Appointment a WHERE a.patient_id = :patientId")
    List<Appointment> findByPatientId(@Param("patientId") UUID patientId);
}
//@Modifying
//@Transactional
//@Query(value = """
//    UPDATE appoint`
//
