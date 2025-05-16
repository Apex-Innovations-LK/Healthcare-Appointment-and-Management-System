package manager.resources.resource_manage_service.service;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import manager.resources.resource_manage_service.kafkaProducer;

@RestController
public class KafkaController {

    private final kafkaProducer producer;

    public KafkaController(kafkaProducer producer) {
        this.producer = producer;
    }

    public void writeMessegeToTopic(@RequestParam("message") String message){
        this.producer.writeMessage(message);
    }
}
