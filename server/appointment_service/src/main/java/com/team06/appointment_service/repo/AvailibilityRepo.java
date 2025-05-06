package com.team06.appointment_service.repo;


import com.team06.appointment_service.model.Availibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface AvailibilityRepo extends JpaRepository<Availibility, UUID> {

}
