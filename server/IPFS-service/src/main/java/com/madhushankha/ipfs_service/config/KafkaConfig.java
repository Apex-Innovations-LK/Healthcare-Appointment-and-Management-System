package com.madhushankha.ipfs_service.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic healthRecordCreatedTopic() {
        return new NewTopic("health.record.created", 1, (short) 1);
    }

    @Bean
    public NewTopic healthRecordPinnedTopic() {
        return new NewTopic("health.record.pinned", 1, (short) 1);
    }
}