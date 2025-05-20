package DoctorMicroservice.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import DoctorMicroservice.dto.DoctorAvailabilityDto;
import DoctorMicroservice.dto.ScheduleSlotDto;
import DoctorMicroservice.dto.ScheduleSlotSearchRequest;
import DoctorMicroservice.entity.DoctorAvailability;
import DoctorMicroservice.entity.ScheduleSlot;
import DoctorMicroservice.kafka.AvailabilityDeletedKafkaProducer;
import DoctorMicroservice.kafka.DoctorAvailabilityKafkaProducer;
import DoctorMicroservice.kafka.ScheduleSlotKafkaProducer;
import DoctorMicroservice.mapper.DoctorAvailabilityMapper;
import DoctorMicroservice.mapper.ScheduleSlotMapper;
import DoctorMicroservice.repository.DoctorSessionRepository;
import DoctorMicroservice.repository.ScheduleSlotRepository;
import DoctorMicroservice.service.DoctorSessionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import DoctorMicroservice.dto.Session_idDto;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorSessionServiceImpl implements DoctorSessionService {
    private final DoctorSessionRepository doctorSessionRepository;
    private final DoctorAvailabilityMapper availabilityMapper;
    private final DoctorAvailabilityKafkaProducer DoctorAvailabilityKafkaProducer;
    private final AvailabilityDeletedKafkaProducer availabilityDeletedKafkaProducer;
    private final ScheduleSlotRepository scheduleSlotRepository;
    private final ScheduleSlotKafkaProducer scheduleSlotKafkaProducer;
    private final ScheduleSlotMapper scheduleSlotMapper;

    @Override
    public DoctorAvailabilityDto addDoctorSession(DoctorAvailabilityDto doctorSessionDto) {

        // Generate session_id if null
        if (doctorSessionDto.getSession_id() == null) {
            doctorSessionDto.setSession_id(UUID.randomUUID());
        }

        // Map and save DoctorSession
        DoctorAvailability doctorSession = availabilityMapper.mapToDoctorAvailability(doctorSessionDto);
        DoctorAvailability savedDocAvailability = doctorSessionRepository.save(doctorSession);

        // Generate ScheduleSlots from 0 to count-1
        int slotCount = savedDocAvailability.getNumber_of_patients();
        List<ScheduleSlot> slots = new ArrayList<>();

        for (int i = 1; i < slotCount + 1; i++) {
            ScheduleSlot slot = new ScheduleSlot();
            slot.setSlotId(UUID.randomUUID()); // Generate a unique UUID for each slot
            slot.setSession_id(savedDocAvailability.getSession_id()); // FK to DoctorSession
            slot.setStatus("available");
            scheduleSlotKafkaProducer.sendDoctorScheduleSlot(scheduleSlotMapper.mapToScheduleSlotDto(slot));
            slots.add(slot);
        }

        scheduleSlotRepository.saveAll(slots);

        // Send Kafka message
        DoctorAvailabilityDto responseDto = availabilityMapper.mapToDoctorAvailabilityDto(savedDocAvailability);
        DoctorAvailabilityKafkaProducer.sendDoctorAvailability(responseDto);

        return responseDto;
    }

    public List<ScheduleSlotDto> getSlotsByDoctorAndDate(ScheduleSlotSearchRequest request) {
        List<ScheduleSlot> slots = scheduleSlotRepository.findByDoctorIdAndDate(request.getDoctorId(),
                request.getDate());
        return slots.stream()
                .map(slot -> new ScheduleSlotDto(slot.getSlotId(), slot.getSession_id(), slot.getStatus()))
                .collect(Collectors.toList());
    }

    public List<DoctorAvailabilityDto> getSessions(ScheduleSlotSearchRequest request) {
        List<DoctorAvailability> slots = doctorSessionRepository.findByDoctorIdAndDateInSessions(request.getDoctorId(),request.getDate());
        return slots.stream()
                .map(slot -> new DoctorAvailabilityDto(slot.getSession_id(), slot.getDoctor_id(), slot.getFrom(), slot.getTo(),
                        slot.getNumber_of_patients()))
                .collect(Collectors.toList());
    }
    
    public DoctorAvailabilityDto updateAvailability(DoctorAvailabilityDto dto) {
    //     DoctorAvailability existing = doctorSessionRepository.findBySessionId(dto.getSession_id())
    //             .orElseThrow(() -> new RuntimeException("Session not found"));

    //     // Update fields
    //     existing.setDoctor_id(dto.getDoctor_id());
    //     existing.setFrom(dto.getFrom());
    //     existing.setTo(dto.getTo());
    //     existing.setNumber_of_patients(dto.getNumber_of_patients());

    //     DoctorAvailability saved = doctorSessionRepository.save(existing);
        
    //     return availabilityMapper.mapToDoctorAvailabilityDto(saved);
    deleteDoctorSession(dto.getSession_id());

    // Add a new session
    return addDoctorSession(dto);

}
    
    @Override
    @Transactional
    public void deleteDoctorSession(UUID sessionId) {
        doctorSessionRepository.deleteBySessionId(sessionId);
        Session_idDto sessionIdDto = new Session_idDto(sessionId);
        availabilityDeletedKafkaProducer.deleteDoctorAvailability(sessionIdDto);
        scheduleSlotRepository.deleteBySessionId(sessionId);
    }
    
}
