package DoctorMicroservice.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import DoctorMicroservice.dto.DoctorAvailabilityDto;

@Service
public class DoctorAvailabilityKafkaProducer {

    private static final Logger LOGGER = LoggerFactory.getLogger(DoctorAvailabilityKafkaProducer.class);
    private static final String TOPIC = "AVAILABILITY_SETTLED";

    private final KafkaTemplate<String, DoctorAvailabilityDto> kafkaTemplate;

    public DoctorAvailabilityKafkaProducer(KafkaTemplate<String, DoctorAvailabilityDto> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendDoctorAvailability(DoctorAvailabilityDto doctorAvailabilityDto) {
        LOGGER.info("Sending doctor Availability to Kafka topic: {}", doctorAvailabilityDto);

        Message<DoctorAvailabilityDto> message = MessageBuilder
                .withPayload(doctorAvailabilityDto)
                .setHeader(KafkaHeaders.TOPIC, TOPIC)
                .build();

        kafkaTemplate.send(message);
    }
}
