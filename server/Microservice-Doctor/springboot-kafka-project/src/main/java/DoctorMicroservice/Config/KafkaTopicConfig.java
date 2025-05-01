package DoctorMicroservice.Config;


import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic DoctorSessionTopic() {
        return TopicBuilder.name("doctor_session")
                .build();
    }

    @Bean
    public NewTopic AppointmentTopic(){
        return TopicBuilder.name("appointment")
                .build();
    }
    
}
