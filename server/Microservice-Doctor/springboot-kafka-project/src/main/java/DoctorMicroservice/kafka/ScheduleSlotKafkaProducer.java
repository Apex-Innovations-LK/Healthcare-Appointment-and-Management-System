package DoctorMicroservice.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import DoctorMicroservice.dto.DoctorSessionDto;
import DoctorMicroservice.dto.ScheduleSlotDto;

@Service
public class ScheduleSlotKafkaProducer {
    private static final Logger LOGGER = LoggerFactory.getLogger(ScheduleSlotKafkaProducer.class);
    private static final String TOPIC = "schedule_slot";

    private final KafkaTemplate<String, ScheduleSlotDto> kafkaTemplate;

    public ScheduleSlotKafkaProducer(KafkaTemplate<String,ScheduleSlotDto > kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendDoctorScheduleSlot(ScheduleSlotDto scheduleSlotDto) {
        LOGGER.info("Sending schedule slots to Kafka topic: {}", scheduleSlotDto);

        Message<ScheduleSlotDto> message = MessageBuilder
                .withPayload(scheduleSlotDto)
                .setHeader(KafkaHeaders.TOPIC, TOPIC)
                .build();

        kafkaTemplate.send(message);
    }

}
