package DoctorMicroservice.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import DoctorMicroservice.entity.DoctorAvailability;

public interface DoctorSessionRepository extends JpaRepository<DoctorAvailability, Long> {
    // Custom query methods can be defined here if needed
    
    @Query("""
    SELECT da FROM DoctorAvailability da
    WHERE da.doctor_id = :doctorId
    AND FUNCTION('DATE', da.from) = FUNCTION('DATE', :date)
    """)
    List<DoctorAvailability> findByDoctorIdAndDateInSessions(@Param("doctorId") UUID doctorId,
            @Param("date") Date date);

    @Query("""
    SELECT da FROM DoctorAvailability da
    WHERE da.session_id = :sessionId
    """)
    Optional<DoctorAvailability> findBySessionId(@Param("sessionId") UUID sessionId);

    @Modifying
    @Query("DELETE FROM DoctorAvailability da WHERE da.session_id = :sessionId")
    void deleteBySessionId(@Param("sessionId") UUID sessionId);

}
