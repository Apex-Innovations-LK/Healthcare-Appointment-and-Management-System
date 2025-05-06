package com.team06.serviceschedule.repo;

import com.team06.serviceschedule.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepo extends JpaRepository<Users, UUID> {
    Optional<Users> findByRole(String role);

    List<Users> findAllByRole(String role);

    @Query("SELECT COUNT(u) FROM Users u WHERE u.role = 'STAFF'")
    long countStaffMembers();
}
