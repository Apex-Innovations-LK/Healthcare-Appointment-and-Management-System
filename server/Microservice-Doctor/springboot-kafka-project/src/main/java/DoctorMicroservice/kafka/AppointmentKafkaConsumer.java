package DoctorMicroservice.kafka;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import DoctorMicroservice.dto.KafkaConsumerDto;
import DoctorMicroservice.dto.ScheduleSlotDto;
import DoctorMicroservice.service.ScheduleSlotService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentKafkaConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(AppointmentKafkaConsumer.class);
    private final ScheduleSlotService scheduleSlotService;
 // temporily made the topic to schedule_slot, but actually it should be a new topic to which booked appointments are notified to 
    @KafkaListener(topics = "appointment_booked",groupId ="booked_appointments")
    public void update(KafkaConsumerDto Dto) {
        LOGGER.info("Updated appointment status to booked", Dto);
        scheduleSlotService.updateScheduleSlot(Dto);
    }
}
