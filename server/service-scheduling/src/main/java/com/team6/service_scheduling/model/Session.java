package main.java.com.team6.service_scheduling.model;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "session")
public class Session {

    @Id
    @Column(name = "session_id")
    private UUID sessionId;

    @Column(name = "doctor_id", nullable = false)
    private UUID doctorId;

    @Column(name = "staff_id")
    private UUID staffId;

    @Column(name = "from")
    private Timestamp from;

    @Column(name = "to")
    private Timestamp to;

    @Column(name = "number_of_patients")
    private int numberOfPatients;

    // Getters and setters
    public UUID getSessionId() {
        return sessionId;
    }

    public void setSessionId(UUID sessionId) {
        this.sessionId = sessionId;
    }

    public UUID getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(UUID doctorId) {
        this.doctorId = doctorId;
    }

    public UUID getStaffId() {
        return staffId;
    }

    public void setStaffId(UUID staffId) {
        this.staffId = staffId;
    }

    public Timestamp getFrom() {
        return from;
    }

    public void setFrom(Timestamp from) {
        this.from = from;
    }

    public Timestamp getTo() {
        return to;
    }

    public void setTo(Timestamp to) {
        this.to = to;
    }

    public int getNumberOfPatients() {
        return numberOfPatients;
    }

    public void setNumberOfPatients(int numberOfPatients) {
        this.numberOfPatients = numberOfPatients;
    }
}
