package DoctorMicroservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import DoctorMicroservice.entity.DoctorAvailability;

public interface DoctorSessionRepository extends JpaRepository<DoctorAvailability, Long> {
    // Custom query methods can be defined here if needed

}
