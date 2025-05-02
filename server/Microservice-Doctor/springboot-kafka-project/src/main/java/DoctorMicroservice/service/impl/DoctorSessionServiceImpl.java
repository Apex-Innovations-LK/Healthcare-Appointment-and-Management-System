package DoctorMicroservice.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import DoctorMicroservice.dto.DoctorSessionDto;
import DoctorMicroservice.entity.DoctorSession;
import DoctorMicroservice.entity.ScheduleSlot;
import DoctorMicroservice.kafka.DoctorSessionKafkaProducer;
import DoctorMicroservice.mapper.DoctorSessionMapper;
import DoctorMicroservice.repository.DoctorSessionRepository;
import DoctorMicroservice.repository.ScheduleSlotRepository;
import DoctorMicroservice.service.DoctorSessionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import DoctorMicroservice.mapper.ScheduleSlotMapper;
import DoctorMicroservice.kafka.ScheduleSlotKafkaProducer;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorSessionServiceImpl implements DoctorSessionService {
    private final DoctorSessionRepository doctorSessionRepository;
    private final DoctorSessionMapper availabilityMapper;
    private final DoctorSessionKafkaProducer doctorSessionKafkaProducer;
    private final ScheduleSlotRepository scheduleSlotRepository;
    private final ScheduleSlotKafkaProducer scheduleSlotKafkaProducer;
    private final ScheduleSlotMapper scheduleSlotMapper; 


    // @Override
    // public DoctorSessionDto addDoctorSession(DoctorSessionDto doctorSessionDto) {
    //     DoctorSession doctorSession = availabilityMapper.mapToDoctorSession(doctorSessionDto);
    //     DoctorSession savedDoc = doctorSessionRepository.save(doctorSession);
    //     DoctorSessionDto responseDto = availabilityMapper.mapToDoctorSessionDto(savedDoc);
    //     doctorSessionKafkaProducer.sendDoctorSession(responseDto);

    //     return responseDto;
    // }

    @Override
    public DoctorSessionDto addDoctorSession(DoctorSessionDto doctorSessionDto) {
        // Map and save DoctorSession
        DoctorSession doctorSession = availabilityMapper.mapToDoctorSession(doctorSessionDto);
        DoctorSession savedDoc = doctorSessionRepository.save(doctorSession);
        
        // Generate ScheduleSlots from 0 to count-1
        int slotCount = savedDoc.getCount();
        List<ScheduleSlot> slots = new ArrayList<>();

        for (int i = 1; i < slotCount+1; i++) {
            ScheduleSlot slot = new ScheduleSlot();
            slot.setSlotId((long) i);  // Manually set from 0 to count-1
            slot.setSession(savedDoc); // FK to DoctorSession
            slot.setStatus("available");
            scheduleSlotKafkaProducer.sendDoctorScheduleSlot(scheduleSlotMapper.mapToScheduleSlotDto(slot));
            slots.add(slot);
        }

        scheduleSlotRepository.saveAll(slots);

        // Send Kafka message
        DoctorSessionDto responseDto = availabilityMapper.mapToDoctorSessionDto(savedDoc);
        doctorSessionKafkaProducer.sendDoctorSession(responseDto);

        return responseDto;
}

    
}
