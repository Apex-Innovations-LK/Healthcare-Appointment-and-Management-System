// package com.team07.ipfs_service.services.consumer;

// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.team07.ipfs_service.dto.HealthRecord;
// import com.team07.ipfs_service.dto.HealthRecordHashed;
// import com.team07.ipfs_service.services.producer.IPFSProducer;
// import com.team07.ipfs_service.constants.KafkaTopics;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.core.io.ByteArrayResource;
// import org.springframework.http.MediaType;
// import org.springframework.http.client.MultipartBodyBuilder;
// import org.springframework.kafka.annotation.KafkaListener;
// import org.springframework.stereotype.Service;
// import org.springframework.web.reactive.function.BodyInserters;
// import org.springframework.web.reactive.function.client.WebClient;

// import java.nio.charset.StandardCharsets;

// @Service
// public class IPFSListener {

//     private final ObjectMapper objectMapper;
//     private final IPFSProducer producer;
//     private final WebClient webClient;
    
//     @Value("${upload.service.url:http://127.0.0.1:8081/upload}")
//     private String uploadServiceUrl;
    
//     public IPFSListener(ObjectMapper objectMapper, IPFSProducer producer) {
//         this.objectMapper = objectMapper;
//         this.producer = producer;
//         this.webClient = WebClient.builder().baseUrl(uploadServiceUrl).build();
//     }

//     @KafkaListener(topics = KafkaTopics.IPFS_TOPIC, groupId = "health-record-group")
//     public void consumePatientRecord(String message) {
//         try {
//             HealthRecord record = objectMapper.readValue(message, HealthRecord.class);
//             System.out.println("✅ Consumed Record from health record service: " + record);

//             // Convert record metadata to bytes for file upload
//             byte[] fileContent = record.getMetadata().getBytes(StandardCharsets.UTF_8);
            
//             // Create multipart body
//             MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
//             bodyBuilder.part("file", new ByteArrayResource(fileContent))
//                 .filename(record.getRecordId() + ".json");
//             bodyBuilder.part("recordId", record.getRecordId());
//             bodyBuilder.part("patientId", record.getPatientId());
            
//             // Make the API call
//             String ipfsHash = webClient.post()
//                 .contentType(MediaType.MULTIPART_FORM_DATA)
//                 .body(BodyInserters.fromMultipartData(bodyBuilder.build()))
//                 .retrieve()
//                 .bodyToMono(String.class)
//                 .block(); // Block for synchronous response
            
//             System.out.println("📦 Added Record to IPFS via API: " + ipfsHash);
            
//             // Create HealthRecordHashed object
//             HealthRecordHashed hashedRecord = new HealthRecordHashed(
//                 record.getRecordId(), 
//                 record.getPatientId(), 
//                 ipfsHash
//             );
            
//             producer.sendToBlockchain(hashedRecord);
//             System.out.println("➡️ Sent to Blockchain topic");
            
//         } catch (Exception e) {
//             System.err.println("❌ Error processing record: " + e.getMessage());
//             e.printStackTrace();
//         }
//     }
// }