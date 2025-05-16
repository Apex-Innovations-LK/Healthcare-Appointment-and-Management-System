package com.team06.serviceschedule.repo;

import com.team06.serviceschedule.dto.ScheduleDto;
import com.team06.serviceschedule.model.SessionAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface SessionAssignmentRepo extends JpaRepository<SessionAssignment, UUID> {

//    @Query(value = """
//    SELECT session_assignment.doctor_id, session_assignment.from, session_assignment.to
//    FROM schedulaservice.session_assignment
//    WHERE session_assignment.staff_id = :staff_id
//""", nativeQuery = true)
//    ScheduleDto[] getSchedule(@Param("staff_id") UUID staff_id);

    @Query(value = """
    SELECT sa.doctor_id as doctor_id, 
           sa.from as from, 
           sa.to as to
    FROM schedulaservice.session_assignment sa
    WHERE sa.staff_id = :staff_id
""", nativeQuery = true)
    List<ScheduleDto> getSchedule(@Param("staff_id") UUID staff_id);

}
