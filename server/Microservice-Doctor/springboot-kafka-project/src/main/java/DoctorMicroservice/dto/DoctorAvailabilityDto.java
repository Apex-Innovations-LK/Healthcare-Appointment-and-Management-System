// 
package DoctorMicroservice.dto;

import java.util.Date;
import java.util.UUID;

public class DoctorAvailabilityDto {
    private UUID session_id;
    private UUID doctor_id;
    private Date from;
    private Date to;
    private int number_of_patients;

    // No-args constructor
    public DoctorAvailabilityDto() {
    }

    // All-args constructor
    public DoctorAvailabilityDto(UUID session_id, UUID doctor_id, Date from, Date to, int number_of_patients) {
        this.session_id = session_id;
        this.doctor_id = doctor_id;
        this.from = from;
        this.to = to;
        this.number_of_patients = number_of_patients;
    }

    // Getters and Setters
    public UUID getSession_id() {
        return session_id;
    }

    public void setSession_id(UUID session_id) {
        this.session_id = session_id;
    }

    public UUID getDoctor_id() {
        return doctor_id;
    }

    public void setDoctor_id(UUID doctor_id) {
        this.doctor_id = doctor_id;
    }

    public Date getFrom() {
        return from;
    }

    public void setFrom(Date from) {
        this.from = from;
    }

    public Date getTo() {
        return to;
    }

    public void setTo(Date to) {
        this.to = to;
    }

    public int getNumber_of_patients() {
        return number_of_patients;
    }

    public void setNumber_of_patients(int number_of_patients) {
        this.number_of_patients = number_of_patients;
    }
}