package DoctorMicroservice.dto;

import java.util.UUID;

public class SessionIdDto {
    private UUID sessionId;

    // Default constructor
    public SessionIdDto() {
    }

    // Parameterized constructor
    public SessionIdDto(UUID sessionId) {
        this.sessionId = sessionId;
    }

    // Getter
    public UUID getSessionId() {
        return sessionId;
    }

    // Setter
    public void setSessionId(UUID sessionId) {
        this.sessionId = sessionId;
    }
}