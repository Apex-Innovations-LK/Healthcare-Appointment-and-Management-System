package DoctorMicroservice.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import DoctorMicroservice.entity.ScheduleSlot;
import jakarta.transaction.Transactional;

public interface ScheduleSlotRepository extends JpaRepository<ScheduleSlot, UUID> {
    // Custom query methods can be defined here if needed
    Optional<ScheduleSlot> findBySlotId(UUID slotId);
    
    @Query("""
    SELECT s FROM ScheduleSlot s
    JOIN DoctorAvailability da ON s.session_id = da.session_id
    WHERE da.doctor_id = :doctorId
    AND FUNCTION('DATE', da.from) = FUNCTION('DATE', :date)
    """)
    List<ScheduleSlot> findByDoctorIdAndDate(@Param("doctorId") UUID doctorId, @Param("date") Date date);

    @Query("""
    SELECT s FROM ScheduleSlot s
    WHERE session_id = :sessionId
    """)
    List<ScheduleSlot> findBySessionId(@Param("sessionId") UUID sessionId);


    @Modifying
    @Query("DELETE FROM ScheduleSlot ss WHERE ss.session_id = :sessionId")
    void deleteBySessionId(@Param("sessionId") UUID sessionId);
    

}
