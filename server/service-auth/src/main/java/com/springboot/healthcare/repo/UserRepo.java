package com.springboot.healthcare.repo;

import com.springboot.healthcare.dto.DoctorDetails;
import com.springboot.healthcare.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepo extends JpaRepository<Users, UUID> {
    //Users findByUsername(String username);
    Optional<Users> findByUsername(String username);

//    Optional<Users> findById(UUID id);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    Long countByRole(String role);

    @Query( value = """
        SELECT 
                users.id, 
                users.first_name,
                users.last_name,
                doctor.speciality,
                doctor.license_number 
        FROM 
                authservice.users JOIN authservice.doctor ON users.id = doctor.id
                """, nativeQuery = true)
    List<DoctorDetails> findAllDoctors();

    @Query(value = """
        SELECT 
                users.id, 
                users.first_name,
                users.last_name,
                doctor.speciality,
                doctor.license_number 
        FROM 
                users JOIN doctor ON users.id = doctor.id
        WHERE 
                users.id = :doctorId
                """, nativeQuery = true)
    DoctorDetails findDoctorById(UUID doctorId);
}

