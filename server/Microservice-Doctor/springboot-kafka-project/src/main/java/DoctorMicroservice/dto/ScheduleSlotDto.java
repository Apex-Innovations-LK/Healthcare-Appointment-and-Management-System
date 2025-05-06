package DoctorMicroservice.dto;


import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleSlotDto {
    private UUID slotId;
    private UUID session_id;
    private String status;
}