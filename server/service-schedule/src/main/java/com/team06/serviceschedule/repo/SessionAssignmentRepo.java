package com.team06.serviceschedule.repo;

import com.team06.serviceschedule.model.SessionAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface SessionAssignmentRepo extends JpaRepository<SessionAssignment, UUID> {
}
