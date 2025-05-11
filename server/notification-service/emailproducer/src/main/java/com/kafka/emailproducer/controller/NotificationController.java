package com.kafka.emailproducer.controller;

import com.kafka.emailproducer.model.EmailRequest;
import com.kafka.emailproducer.service.KafkaSenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notify")
public class NotificationController {

    @Autowired
    private KafkaSenderService kafkaSenderService;

    @PostMapping("/send")
    public String sendEmailViaKafka(@RequestBody EmailRequest request) {
        String jsonMessage = String.format(
                "{\"to\": \"%s\", \"subject\": \"%s\", \"body\": \"%s\"}",
                request.getTo(), request.getSubject(), request.getBody()
        );

        kafkaSenderService.sendToTopic("notification-topic", jsonMessage);

        return "✅ Email request sent to Kafka topic 'notification-topic'";
    }
}
