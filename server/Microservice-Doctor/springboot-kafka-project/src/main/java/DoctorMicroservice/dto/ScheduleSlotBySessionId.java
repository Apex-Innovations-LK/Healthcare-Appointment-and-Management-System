package DoctorMicroservice.dto;

import java.util.UUID;

public class ScheduleSlotBySessionId {
    private UUID sessionId;

    // No-argument constructor
    public ScheduleSlotBySessionId() {
    }

    // All-argument constructor
    public ScheduleSlotBySessionId(UUID sessionId) {
        this.sessionId = sessionId;
    }
    
    // Getter and Setter for sessionId
    public UUID getSessionId() {
        return sessionId;
    }
    public void setSessionId(UUID sessionId) {
        this.sessionId = sessionId;
    }

    
}
