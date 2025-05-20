package com.springboot.healthcare.model;

import jakarta.persistence.*;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "staff", schema = "authservice")
public class Staff {

    @Id
    private UUID id;  // shared with Users.id

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")  // foreign key to Users.id
    private Users user;

    @ElementCollection
    @CollectionTable(
            name = "staff_availability",
            joinColumns = @JoinColumn(name = "staff_id")
    )
    @Column(name = "available_date")
    @Temporal(TemporalType.TIMESTAMP)
    private List<Date> availabilitySchedule;

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

    public List<Date> getAvailabilitySchedule() {
        return availabilitySchedule;
    }

    public void setAvailabilitySchedule(List<Date> availabilitySchedule) {
        this.availabilitySchedule = availabilitySchedule;
    }

    @Override
    public String toString() {
        return "Staff{" +
                "id=" + id +
                ", availabilitySchedule=" + availabilitySchedule +
                '}';
    }
}
