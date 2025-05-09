package com.team06.appointment_service.repo;


import com.team06.appointment_service.model.Availibility;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface AvailibilityRepo extends JpaRepository<Availibility, UUID> {

    @Modifying
    @Transactional
    @Query(value = """
        DELETE FROM appointmentservice.availibility
        WHERE session_id = :session_id
    """, nativeQuery = true)
    void deleteAvailability(@Param("session_id") UUID session_id);
}
