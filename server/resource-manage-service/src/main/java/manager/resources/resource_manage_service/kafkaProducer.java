package manager.resources.resource_manage_service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class kafkaProducer {

    private static final String Topic = "my_topic";

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void writeMessage(String message) {

        this.kafkaTemplate.send(Topic , message);

    }

}
