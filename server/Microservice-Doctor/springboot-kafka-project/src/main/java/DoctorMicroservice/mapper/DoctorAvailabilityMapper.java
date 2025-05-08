package DoctorMicroservice.mapper;

import org.springframework.stereotype.Component;

import DoctorMicroservice.dto.DoctorAvailabilityDto;
import DoctorMicroservice.entity.DoctorAvailability;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class DoctorAvailabilityMapper {

        public DoctorAvailabilityDto mapToDoctorAvailabilityDto(DoctorAvailability doctorAvailability) {
                return new DoctorAvailabilityDto(
                                doctorAvailability.getSession_id(),
                                doctorAvailability.getDoctor_id(),
                                doctorAvailability.getTo(),
                                doctorAvailability.getFrom(),
                                doctorAvailability.getNumber_of_patients());
        }

        public DoctorAvailability mapToDoctorAvailability(DoctorAvailabilityDto dto) {
                // Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                //                 .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

                return new DoctorAvailability(
                                dto.getSession_id(),
                                dto.getDoctor_id(),
                                dto.getTo(),
                                dto.getFrom(),
                                dto.getNumber_of_patients());
        }
}