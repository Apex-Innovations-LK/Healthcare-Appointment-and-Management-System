package com.team06.serviceschedule.config;

import com.team06.serviceschedule.dto.UserKafkaEvent;
import com.team06.serviceschedule.dto.DoctorKafkaEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@EnableKafka
@Configuration
public class KafkaConsumerConfig {

    private Map<String, Object> consumerConfigs() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "group_id");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        return props;
    }

    @Bean
    public ConsumerFactory<String, UserKafkaEvent> userKafkaEventConsumerFactory() {
        JsonDeserializer<UserKafkaEvent> deserializer = new JsonDeserializer<>(UserKafkaEvent.class);
        deserializer.addTrustedPackages("*");

        return new DefaultKafkaConsumerFactory<>(
                consumerConfigs(),
                new StringDeserializer(),
                deserializer
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, UserKafkaEvent> userKafkaEventListenerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, UserKafkaEvent> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(userKafkaEventConsumerFactory());
        return factory;
    }

    @Bean
    public ConsumerFactory<String, DoctorKafkaEvent> doctorKafkaEventConsumerFactory() {
        JsonDeserializer<DoctorKafkaEvent> deserializer = new JsonDeserializer<>(DoctorKafkaEvent.class);
        deserializer.addTrustedPackages("*");

        return new DefaultKafkaConsumerFactory<>(
                consumerConfigs(),
                new StringDeserializer(),
                deserializer
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, DoctorKafkaEvent> doctorKafkaEventListenerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, DoctorKafkaEvent> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(doctorKafkaEventConsumerFactory());
        return factory;
    }
}
