package DoctorMicroservice.service;

import java.util.List;
import java.util.UUID;

import DoctorMicroservice.dto.DoctorAvailabilityDto;
import DoctorMicroservice.dto.ScheduleSlotSearchRequest;
public interface DoctorSessionService {
    DoctorAvailabilityDto addDoctorSession(DoctorAvailabilityDto doctorSessionDto);

    List<DoctorAvailabilityDto> getSessions(ScheduleSlotSearchRequest request);

    //DoctorAvailabilityDto updateSessionTime(UpdateTimeRequest request);
    void deleteDoctorSession(UUID sessionId);
    DoctorAvailabilityDto updateAvailability(DoctorAvailabilityDto dto);
}
