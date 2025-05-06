package DoctorMicroservice.dto;


import java.util.Date;
import java.util.UUID;

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
public class DoctorAvailabilityDto {
    private UUID session_id;
    private UUID doctor_id;
    private Date from;
    private Date to;
    private int number_of_patients;

}