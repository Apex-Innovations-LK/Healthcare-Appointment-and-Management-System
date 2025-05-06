package DoctorMicroservice.dto;

import java.util.Date;
import java.util.UUID;

import lombok.Data;

@Data
public class ScheduleSlotSearchRequest {
    private UUID doctorId;
    private Date date; // we'll compare this with doctor_availability.start_time
}
