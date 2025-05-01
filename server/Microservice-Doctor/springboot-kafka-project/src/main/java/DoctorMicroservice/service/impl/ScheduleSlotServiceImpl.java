package DoctorMicroservice.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import DoctorMicroservice.dto.ScheduleSlotDto;
import DoctorMicroservice.entity.ScheduleSlot;
import DoctorMicroservice.kafka.AppointmentKafkaConsumer;
import DoctorMicroservice.mapper.ScheduleSlotMapper;
import DoctorMicroservice.repository.ScheduleSlotRepository;
import DoctorMicroservice.service.ScheduleSlotService;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ScheduleSlotServiceImpl implements ScheduleSlotService {

    private final ScheduleSlotRepository scheduleSlotRepository;
    private final ScheduleSlotMapper scheduleSlotMapper;
    private final AppointmentKafkaConsumer appointmentKafkaConsumer;


    @Override
    public ScheduleSlotDto rejectScheduleSlot(ScheduleSlotDto scheduleSlotDto) {
        ScheduleSlot slot = scheduleSlotRepository.findById(scheduleSlotDto.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        slot.setStatus("rejected");
        scheduleSlotRepository.save(slot);
        appointmentKafkaConsumer.consume(scheduleSlotDto); 
        return scheduleSlotMapper.mapToScheduleSlotDto(slot);
    }

}
