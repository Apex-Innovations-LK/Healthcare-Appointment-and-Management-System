package DoctorMicroservice.dto;


import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DoctorSessionDto {
    private Long doctorSessionId;
    private Long doctorId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int count;

}