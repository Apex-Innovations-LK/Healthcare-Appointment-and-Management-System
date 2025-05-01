package com.springboot.healthcare.repo;

import com.springboot.healthcare.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
public interface DoctorRepo extends JpaRepository<Doctor, UUID> {
    
    @Query("SELECT d FROM Doctor d JOIN d.user u WHERE u.role = 'DOCTOR'")
    List<Doctor> findAllDoctors();
}
