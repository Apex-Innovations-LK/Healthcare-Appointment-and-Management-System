package com.springboot.healthcare.repo;

import com.springboot.healthcare.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepo extends JpaRepository<Users, UUID> {
    Users findByusername(String username);

    }
