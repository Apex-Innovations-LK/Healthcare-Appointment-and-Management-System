package DoctorMicroservice.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import DoctorMicroservice.dto.ScheduleSlotBySessionId;
import DoctorMicroservice.dto.ScheduleSlotDto;
import DoctorMicroservice.dto.ScheduleSlotSearchRequest;
import DoctorMicroservice.entity.DoctorAvailability;
import DoctorMicroservice.entity.ScheduleSlot;
import DoctorMicroservice.kafka.RejectAppointmentKafkaProducer;
import DoctorMicroservice.mapper.ScheduleSlotMapper;
import DoctorMicroservice.repository.ScheduleSlotRepository;
import DoctorMicroservice.service.ScheduleSlotService;
import lombok.RequiredArgsConstructor;
import DoctorMicroservice.repository.DoctorSessionRepository;


@Service
@Transactional
@RequiredArgsConstructor
public class ScheduleSlotServiceImpl implements ScheduleSlotService {

    private final ScheduleSlotRepository scheduleSlotRepository;
    private final DoctorSessionRepository doctorSessionRepository;
    private final ScheduleSlotMapper scheduleSlotMapper;
    //private final AppointmentKafkaConsumer appointmentKafkaConsumer;
    private final RejectAppointmentKafkaProducer rejectAppointmentKafkaProducer;


    @Override
    public ScheduleSlotDto rejectScheduleSlot(ScheduleSlotDto scheduleSlotDto) {
        UUID slotId = scheduleSlotDto.getSlotId();

        ScheduleSlot slot = scheduleSlotRepository.findBySlotId(slotId)
            .orElseThrow(() -> new RuntimeException("Slot not found"));

        slot.setStatus("rejected");
        scheduleSlotRepository.save(slot);
        rejectAppointmentKafkaProducer.rejectAppointment(scheduleSlotDto);
        return scheduleSlotMapper.mapToScheduleSlotDto(slot);
    }
    
    @Override
    public ScheduleSlotDto updateScheduleSlot(ScheduleSlotDto scheduleSlotDto) {
        UUID slotId = scheduleSlotDto.getSlotId();

        ScheduleSlot slot = scheduleSlotRepository.findBySlotId(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        slot.setStatus("booked");
        scheduleSlotRepository.save(slot);
        //appointmentKafkaConsumer.update(scheduleSlotDto);
        return scheduleSlotMapper.mapToScheduleSlotDto(slot);
    }
    
    
    

    // public List<ScheduleSlotDto> getSlotsByDoctorAndDate(ScheduleSlotSearchRequest request) {
    //     List<ScheduleSlot> slots = scheduleSlotRepository.findByDoctorIdAndDate(request.getDoctorId(),
    //             request.getDate());
    //     return slots.stream()
    //             .map(slot -> new ScheduleSlotDto(slot.getSlotId(), slot.getSession_id(), slot.getStatus()))
    //             .collect(Collectors.toList());
    // }

    public List<ScheduleSlotDto> getSlotsOfSession(ScheduleSlotBySessionId request) {
        List<ScheduleSlot> slots = scheduleSlotRepository.findBySessionId(request.getSessionId());
        return slots.stream()
                .map(slot -> new ScheduleSlotDto(slot.getSlotId(), slot.getSession_id(), slot.getStatus()))
                .collect(Collectors.toList());
        
    }
   


}
