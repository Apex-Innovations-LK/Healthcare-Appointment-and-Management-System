package com.springboot.healthcare.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.springboot.healthcare.dto.UserKafkaEvent;
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

    @Value("${kafka.topic.user-created}")
    private String userCreatedTopic;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void sendMessage(String message) {
        logger.info("Sending message to topic {}: {}", userCreatedTopic, message);
        CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send(userCreatedTopic, UUID.randomUUID().toString(), message);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                logger.info("Message sent successfully to topic {}: {}",
                        userCreatedTopic, message);
            } else {
                logger.error("Failed to send message to topic {}: {}",
                        userCreatedTopic, ex.getMessage());
            }
        });
    }

    public void sendUserCreatedEvent(UserKafkaEvent userEvent) {
        try {
            String userJson = objectMapper.writeValueAsString(userEvent);
            sendMessage(userJson);
        } catch (Exception e) {
            logger.error("Error serializing user event: {}", e.getMessage());
        }
    }
}