package DoctorMicroservice.dto;


import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleSlotDto {
    private Long slotId;
    private Long sessionId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
}