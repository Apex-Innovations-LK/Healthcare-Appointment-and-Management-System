package DoctorMicroservice.service.impl;

import org.springframework.stereotype.Service;

import DoctorMicroservice.dto.DoctorSessionDto;
import DoctorMicroservice.entity.DoctorSession; 
import DoctorMicroservice.kafka.DoctorSessionKafkaProducer;
import DoctorMicroservice.mapper.DoctorSessionMapper;
import DoctorMicroservice.repository.DoctorSessionRepository;
import DoctorMicroservice.service.DoctorSessionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorSessionServiceImpl implements DoctorSessionService {
    private final DoctorSessionRepository doctorSessionRepository;
    private final DoctorSessionMapper availabilityMapper;
    private final DoctorSessionKafkaProducer doctorSessionKafkaProducer;


    @Override
    public DoctorSessionDto addDoctorSession(DoctorSessionDto doctorSessionDto) {
        DoctorSession doctorSession = availabilityMapper.mapToDoctorSession(doctorSessionDto);
        DoctorSession savedDoc = doctorSessionRepository.save(doctorSession);
        DoctorSessionDto responseDto = availabilityMapper.mapToDoctorSessionDto(savedDoc);
        doctorSessionKafkaProducer.sendDoctorSession(responseDto);

        
        return responseDto;
    }
}
