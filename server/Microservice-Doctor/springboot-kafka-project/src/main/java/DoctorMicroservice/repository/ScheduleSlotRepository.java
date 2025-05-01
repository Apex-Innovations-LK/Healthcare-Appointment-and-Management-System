package DoctorMicroservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import DoctorMicroservice.entity.ScheduleSlot;

public interface ScheduleSlotRepository extends JpaRepository<ScheduleSlot, Long> {
    // Custom query methods can be defined here if needed

}
