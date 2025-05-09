package com.kafka.emailproducer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaSenderService {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendToTopic(String topic, String message) {
        kafkaTemplate.send(topic, message);
    }
}
