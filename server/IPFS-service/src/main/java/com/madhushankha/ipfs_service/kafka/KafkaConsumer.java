package com.madhushankha.ipfs_service.kafka;
   
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.madhushankha.ipfs_service.dto.HealthRecordCreatedEvent;
import com.madhushankha.ipfs_service.dto.HealthRecordPinnedEvent;
import com.madhushankha.ipfs_service.services.IPFSUploader;

@Service
public class KafkaConsumer {

    private final IPFSUploader ipfsUploader;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public KafkaConsumer(IPFSUploader ipfsUploader, KafkaTemplate<String, Object> kafkaTemplate) {
        this.ipfsUploader = ipfsUploader;
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(topics = "health.record.created", groupId = "ipfs-group", containerFactory = "kafkaListenerContainerFactory")
    public void handleHealthRecordCreated(HealthRecordCreatedEvent event) throws Exception {
        String hash = ipfsUploader.uploadToIPFS(event.getFileContentBase64(), event.getFileName());

        HealthRecordPinnedEvent pinnedEvent = new HealthRecordPinnedEvent(
                event.getRecordId(),
                event.getFileName(),
                hash,
                event.getUploader()
        );

        kafkaTemplate.send("health.record.pinned", pinnedEvent);
    }
}
