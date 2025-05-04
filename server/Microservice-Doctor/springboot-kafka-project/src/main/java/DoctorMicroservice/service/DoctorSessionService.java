package DoctorMicroservice.service;

import DoctorMicroservice.dto.DoctorAvailabilityDto;

public interface DoctorSessionService {
    DoctorAvailabilityDto addDoctorSession(DoctorAvailabilityDto doctorSessionDto);
}
