package DoctorMicroservice.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import DoctorMicroservice.entity.Doctor;


public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    

}
