// 
package DoctorMicroservice.entity;

import java.util.Date;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "doctor_availability")
public class DoctorAvailability {
    @Id
    @Column(name = "session_id", nullable = false)
    private UUID session_id;

    //@ManyToOne(fetch = FetchType.LAZY)
    @Column(name = "doctor_id", nullable = false)
    private UUID doctor_id;

    @Column(name = "start_time", nullable = false, columnDefinition = "TIMESTAMP")
    private Date from;

    @Column(name = "end_time", nullable = false, columnDefinition = "TIMESTAMP")
    private Date to;

    @Column(name = "count", nullable = false)
    private int number_of_patients;

    // No-argument constructor
    public DoctorAvailability() {
    }

    // All-argument constructor
    public DoctorAvailability(UUID session_id, UUID doctor_id, Date from, Date to, int number_of_patients) {
        this.session_id = session_id;
        this.doctor_id = doctor_id;
        this.from = from;
        this.to = to;
        this.number_of_patients = number_of_patients;
    }

    // Getter and Setter for session_id
    public UUID getSession_id() {
        return session_id;
    }

    public void setSession_id(UUID session_id) {
        this.session_id = session_id;
    }

    // Getter and Setter for doctor_id
    public UUID getDoctor_id() {
        return doctor_id;
    }

    public void setDoctor_id(UUID doctor_id) {
        this.doctor_id = doctor_id;
    }

    // Getter and Setter for from
    public Date getFrom() {
        return from;
    }

    public void setFrom(Date from) {
        this.from = from;
    }

    // Getter and Setter for to
    public Date getTo() {
        return to;
    }

    public void setTo(Date to) {
        this.to = to;
    }

    // Getter and Setter for number_of_patients
    public int getNumber_of_patients() {
        return number_of_patients;
    }

    public void setNumber_of_patients(int number_of_patients) {
        this.number_of_patients = number_of_patients;
    }
}