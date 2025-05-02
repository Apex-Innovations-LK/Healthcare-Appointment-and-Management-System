package com.team06.serviceschedule.repo;

import com.team06.serviceschedule.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepo extends JpaRepository<Users, UUID> {
    Optional<Users> findByRole(String role);

    List<Users> findAllByRole(String role);
}
