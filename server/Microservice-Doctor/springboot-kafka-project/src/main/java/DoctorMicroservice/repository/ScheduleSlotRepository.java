package DoctorMicroservice.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import DoctorMicroservice.entity.ScheduleSlot;

public interface ScheduleSlotRepository extends JpaRepository<ScheduleSlot, UUID> {
    // Custom query methods can be defined here if needed
    Optional<ScheduleSlot> findBySlotId(UUID slotId);

}
