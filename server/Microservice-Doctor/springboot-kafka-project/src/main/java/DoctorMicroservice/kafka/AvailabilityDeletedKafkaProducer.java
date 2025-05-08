
package DoctorMicroservice.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import DoctorMicroservice.dto.DoctorAvailabilityDto;
import DoctorMicroservice.dto.SessionIdDto;

@Service
public class AvailabilityDeletedKafkaProducer {

    private static final Logger LOGGER = LoggerFactory.getLogger(DoctorAvailabilityKafkaProducer.class);
    private static final String TOPIC = "availability_deleted";

    private final KafkaTemplate<String, DoctorAvailabilityDto> kafkaTemplate;

    public AvailabilityDeletedKafkaProducer(KafkaTemplate<String, DoctorAvailabilityDto> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void deleteDoctorAvailability(SessionIdDto Dto) {
        LOGGER.info("Sending deleted doctor Availability to Kafka topic: {}",Dto);

        Message<SessionIdDto> message = MessageBuilder
                .withPayload(Dto)
                .setHeader(KafkaHeaders.TOPIC, TOPIC)
                .build();

        kafkaTemplate.send(message);
    }
}
