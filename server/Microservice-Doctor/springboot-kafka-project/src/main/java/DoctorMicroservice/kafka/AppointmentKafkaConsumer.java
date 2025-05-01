package DoctorMicroservice.kafka;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import DoctorMicroservice.dto.ScheduleSlotDto;
import DoctorMicroservice.service.impl.ScheduleSlotServiceImpl;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentKafkaConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(AppointmentKafkaConsumer.class);
    private final ScheduleSlotServiceImpl scheduleSlotService;

    @KafkaListener(topics = "appointment", containerFactory = "scheduleSlotKafkaListenerContainerFactory")
    public void consume(ScheduleSlotDto scheduleSlotDto) {
        LOGGER.info("Consumed appointment message: {}", scheduleSlotDto);
        scheduleSlotService.rejectScheduleSlot(scheduleSlotDto);
    }
}
