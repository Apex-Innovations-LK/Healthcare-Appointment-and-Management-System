package DoctorMicroservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import DoctorMicroservice.entity.DoctorSession;

public interface DoctorSessionRepository extends JpaRepository<DoctorSession, Long> {
    // Custom query methods can be defined here if needed

}
