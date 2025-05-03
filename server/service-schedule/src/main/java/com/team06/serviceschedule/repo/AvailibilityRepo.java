package com.team06.serviceschedule.repo;

import com.team06.serviceschedule.model.Availibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface AvailibilityRepo extends JpaRepository<Availibility, UUID> {
    @Query("SELECT COUNT(DISTINCT a.doctor_id) FROM Availibility a")
    long countDistinctDoctorsWithAvailability();
}
