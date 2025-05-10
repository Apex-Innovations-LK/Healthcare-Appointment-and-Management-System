package com.team06.appointment_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team06.appointment_service.dto.AppointmentBookedDto;
import com.team06.appointment_service.dto.Notification1Dto;
import com.team06.appointment_service.dto.NotificationDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class KafkaProducerService {
    private static final Logger logger = LoggerFactory.getLogger(KafkaProducerService.class);

    @Value("${kafka.topic.appointment-booked}")
    private String appointmentBookedTopic;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void sendMessageAppointmentBooked(String message) {
        logger.info("Sending message to topic {}: {}", appointmentBookedTopic, message);
        CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send(appointmentBookedTopic, UUID.randomUUID().toString(), message);
        future.whenComplete((result, ex) -> {
            if (ex == null) {
                logger.info("Message sent successfully to topic {}: {}",
                        appointmentBookedTopic, message);
            } else {
                logger.error("Failed to send message to topic {}: {}",
                        appointmentBookedTopic, ex.getMessage());
            }
        });
    }

    public void sendAppointmentBookedEvent(AppointmentBookedDto appointmentBookedDto) {
        try {
            String userJson = objectMapper.writeValueAsString(appointmentBookedDto);
            sendMessageAppointmentBooked(userJson);
        } catch (Exception e) {
            logger.error("Error serializing user event: {}", e.getMessage());
        }
    }

}