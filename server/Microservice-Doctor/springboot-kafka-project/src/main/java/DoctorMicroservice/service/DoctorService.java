package DoctorMicroservice.service;

import DoctorMicroservice.dto.DoctorDto;

public interface DoctorService {
    DoctorDto addDoctor(DoctorDto doctorDto);
}
