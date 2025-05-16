package com.team06.serviceschedule.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team06.serviceschedule.dto.DoctorKafkaEvent;
import com.team06.serviceschedule.dto.UserKafkaEvent;
import com.team06.serviceschedule.model.Availibility;
import com.team06.serviceschedule.model.Users;
import com.team06.serviceschedule.repo.AvailibilityRepo;
import com.team06.serviceschedule.repo.UserRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {
    private static final Logger logger = LoggerFactory.getLogger(KafkaConsumerService.class);

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepo userRepository;
    @Autowired
    private AvailibilityRepo availibilityRepo;

    @KafkaListener(topics = "${kafka.topic.user-created}", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeUserCreatedEvent(String message, Acknowledgment acknowledgment) {
        try {
            logger.info("Received message: {}", message);
            UserKafkaEvent userEvent = objectMapper.readValue(message, UserKafkaEvent.class);
            System.out.println(userEvent.getEventType());
            if ("USER_CREATED".equals(userEvent.getEventType())) {
                processUserCreatedEvent(userEvent);
            } else {
                logger.warn("Unknown event type: {}", userEvent.getEventType());
            }

            // Acknowledge the message after successful processing
            acknowledgment.acknowledge();
            logger.info("User event processed successfully: {}", userEvent);
        } catch (Exception e) {
            logger.error("Error processing Kafka message: {}", e.getMessage(), e);
            // In case of error, we could implement retry logic here or send to DLQ
            // For now, we'll still acknowledge to prevent endless retries
            acknowledgment.acknowledge();
        }
    }

    @KafkaListener(topics = "${kafka.topic.availability-settled}", groupId ="${spring.kafka.consumer.group-id}")
    public void consueAvailabilitySettledEvent(String message, Acknowledgment acknowledgment) {
        try {
            logger.info("Received message: {}", message);
            DoctorKafkaEvent doctorEvent = objectMapper.readValue(message, DoctorKafkaEvent.class);

            if ("AVAILABILITY_SETTLED".equals(doctorEvent.getEventType())) {
                processAvailabilitySettledEvent(doctorEvent);
            } else {
                logger.warn("Unknown event type: {}", doctorEvent.getEventType());
            }

            // Acknowledge the message after successful processing
            acknowledgment.acknowledge();
            logger.info("User event processed successfully: {}", doctorEvent);

        } catch (Exception e) {
            logger.error("Error processing Kafka message: {}", e.getMessage(), e);
            // In case of error, we could implement retry logic here or send to DLQ
            // For now, we'll still acknowledge to prevent endless retries
            acknowledgment.acknowledge();
        }
    }

    private void processUserCreatedEvent(UserKafkaEvent userEvent) {
        if (userRepository.findById(userEvent.getUserId()).isPresent()) {
            logger.info("User already exists with ID: {}", userEvent.getUserId());
            return;
        }

        Users user = new Users ();
        user.setId(userEvent.getUserId());
        user.setEmail(userEvent.getEmail());
        user.setRole(userEvent.getRole());
        user.setUsername(userEvent.getUsername());

        userRepository.save(user);
        logger.info("User saved to database: {}", user);
    }

    private void processAvailabilitySettledEvent(DoctorKafkaEvent doctorEvent) {
        Availibility availibility = new Availibility();
        availibility.setSession_id(doctorEvent.getSession_id());
        availibility.setDoctor_id(doctorEvent.getDoctor_id());
        availibility.setFrom(doctorEvent.getFrom());
        availibility.setTo(doctorEvent.getTo());
        availibility.setNumber_of_patients(doctorEvent.getNumber_of_patients());

        availibilityRepo.save(availibility);
        logger.info("Availability settled to database: {}", availibility);
    }
}