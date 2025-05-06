// package DoctorMicroservice.dto;

// import java.util.Date;
// import java.util.UUID;

// import lombok.Data;

// @Data
// public class ScheduleSlotSearchRequest {
//     private UUID doctorId;
//     private Date date; // we'll compare this with doctor_availability.start_time
// }
package DoctorMicroservice.dto;

import java.util.Date;
import java.util.UUID;

public class ScheduleSlotSearchRequest {
    private UUID doctorId;
    private Date date; // we'll compare this with doctor_availability.start_time

    // No-argument constructor
    public ScheduleSlotSearchRequest() {
    }

    // All-argument constructor
    public ScheduleSlotSearchRequest(UUID doctorId, Date date) {
        this.doctorId = doctorId;
        this.date = date;
    }

    // Getter and Setter for doctorId
    public UUID getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(UUID doctorId) {
        this.doctorId = doctorId;
    }

    // Getter and Setter for date
    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}