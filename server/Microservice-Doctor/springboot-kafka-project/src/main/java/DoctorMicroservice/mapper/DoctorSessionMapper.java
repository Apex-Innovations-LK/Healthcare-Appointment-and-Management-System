package DoctorMicroservice.mapper;

import org.springframework.stereotype.Component;

import DoctorMicroservice.dto.DoctorSessionDto;
import DoctorMicroservice.entity.Doctor;
import DoctorMicroservice.entity.DoctorSession;
import DoctorMicroservice.exception.ResourceNotFoundException;
import DoctorMicroservice.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class DoctorSessionMapper {

        private final DoctorRepository doctorRepository;

        public DoctorSessionDto mapToDoctorSessionDto(DoctorSession doctorSession) {
                return new DoctorSessionDto(
                                doctorSession.getDoctorSessionId(),
                                doctorSession.getDoctor().getDoctorId(),
                                doctorSession.getStartTime(),
                                doctorSession.getEndTime(),
                                doctorSession.getCount());
        }

        public DoctorSession mapToDoctorSession(DoctorSessionDto dto) {
                Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

                return new DoctorSession(
                                dto.getDoctorSessionId(),
                                doctor,
                                dto.getStartTime(),
                                dto.getEndTime(),
                                dto.getCount());
        }
}