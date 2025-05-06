package DoctorMicroservice.repository;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

import DoctorMicroservice.dto.DoctorAvailabilityDto;
import DoctorMicroservice.entity.DoctorAvailability;
import DoctorMicroservice.entity.ScheduleSlot;

public interface DoctorSessionRepository extends JpaRepository<DoctorAvailability, Long> {
    // Custom query methods can be defined here if needed
    
    @Query("""
    SELECT da FROM DoctorAvailability da
    WHERE da.doctor_id = :doctorId
    AND FUNCTION('DATE', da.from) = FUNCTION('DATE', :date)
    """)
    List<DoctorAvailability> findByDoctorIdAndDateInSessions(@Param("doctorId") UUID doctorId, @Param("date") Date date);


}
