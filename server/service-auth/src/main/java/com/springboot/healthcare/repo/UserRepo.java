package com.springboot.healthcare.repo;

import com.springboot.healthcare.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
    }

