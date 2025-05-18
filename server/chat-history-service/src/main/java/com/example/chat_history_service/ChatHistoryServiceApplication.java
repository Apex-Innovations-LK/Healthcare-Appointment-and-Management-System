package com.example.chat_history_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
public class ChatHistoryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChatHistoryServiceApplication.class, args);
    }
}