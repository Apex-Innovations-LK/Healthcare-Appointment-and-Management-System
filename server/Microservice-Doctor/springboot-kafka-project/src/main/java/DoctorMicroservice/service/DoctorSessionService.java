package DoctorMicroservice.service;

import DoctorMicroservice.dto.DoctorAvailabilityDto;
import java.util.List;
import DoctorMicroservice.dto.ScheduleSlotSearchRequest;
public interface DoctorSessionService {
    DoctorAvailabilityDto addDoctorSession(DoctorAvailabilityDto doctorSessionDto);
    List<DoctorAvailabilityDto> getSessions(ScheduleSlotSearchRequest request);
    
}
