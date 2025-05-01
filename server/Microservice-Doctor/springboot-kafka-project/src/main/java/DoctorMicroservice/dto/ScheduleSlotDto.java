package DoctorMicroservice.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleSlotDto {
    private Long slotId;
    private Long sessionId;
    private String status;
}