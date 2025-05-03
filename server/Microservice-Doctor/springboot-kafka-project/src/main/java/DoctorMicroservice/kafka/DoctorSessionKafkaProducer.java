package DoctorMicroservice.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import DoctorMicroservice.dto.DoctorSessionDto;

@Service
public class DoctorSessionKafkaProducer {

    private static final Logger LOGGER = LoggerFactory.getLogger(DoctorSessionKafkaProducer.class);
    private static final String TOPIC = "AVAILABILITY_SETTLED";

    private final KafkaTemplate<String, DoctorSessionDto> kafkaTemplate;

    public DoctorSessionKafkaProducer(KafkaTemplate<String, DoctorSessionDto> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendDoctorSession(DoctorKafkaEvent doctorKafkaEvent) {
        LOGGER.info("Sending doctor session to Kafka topic: {}", doctorKafkaEvent);

        Message<DoctorKafkaEvent> message = MessageBuilder
                .withPayload(doctorKafkaEvent)
                .setHeader(KafkaHeaders.TOPIC, TOPIC)
                .build();

        kafkaTemplate.send(message);
    }
}
