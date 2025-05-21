package DoctorMicroservice.dto;

import java.util.UUID;

public class KafkaConsumerDto {
    private UUID slotId;
    private String status;

    // No-argument constructor
    public KafkaConsumerDto() {
    }

    // All-argument constructor
    public KafkaConsumerDto(UUID slotId, String status) {
        this.slotId = slotId;
        
        this.status = status;
    }

    // Getter and Setter for slotId
    public UUID getSlotId() {
        return slotId;
    }

    public void setSlotId(UUID slotId) {
        this.slotId = slotId;
    }

    
    // Getter and Setter for status
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}