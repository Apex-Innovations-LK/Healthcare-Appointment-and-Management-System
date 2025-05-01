package com.springboot.healthcare.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "staff")
public class Staff {

    @Id
    private UUID id;  // shared with Users.id

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")  // foreign key to Users.id
    private Users user;

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Staff{" +
                "id=" + id +
                '}';
    }
}
