package DoctorMicroservice.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import DoctorMicroservice.dto.ScheduleSlotDto;

@Service
public class RejectAppointmentKafkaProducer {
    private static final Logger LOGGER = LoggerFactory.getLogger(RejectAppointmentKafkaProducer.class);
    private static final String TOPIC = "appointment_rejected";

    private final KafkaTemplate<String, ScheduleSlotDto> kafkaTemplate;

    public RejectAppointmentKafkaProducer(KafkaTemplate<String, ScheduleSlotDto> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void rejectAppointment(ScheduleSlotDto scheduleSlotDto) {
        LOGGER.info("Sending rejected scehduleSlot details to appointment_rejected kafka topic", scheduleSlotDto);

        Message<ScheduleSlotDto> message = MessageBuilder
                .withPayload(scheduleSlotDto)
                .setHeader(KafkaHeaders.TOPIC, TOPIC)
                .build();

        kafkaTemplate.send(message);
    }

}
