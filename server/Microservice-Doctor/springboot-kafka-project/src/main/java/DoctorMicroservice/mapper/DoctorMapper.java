package DoctorMicroservice.mapper;

import DoctorMicroservice.dto.DoctorDto;
import DoctorMicroservice.entity.Doctor;

public class DoctorMapper {
    public static DoctorDto mapToDoctorDto(Doctor doctor){
        return new DoctorDto(
                doctor.getDoctorId(),
                doctor.getSpecialization()
        );
    }
    public static Doctor mapToDoctor(DoctorDto doctorDto){
        return new Doctor(
                doctorDto.getDoctorId(),
                doctorDto.getSpecialization()
        );
    }
}
