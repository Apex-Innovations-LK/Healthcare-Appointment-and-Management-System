package DoctorMicroservice.dto;

import java.util.UUID;

public class UpdatePatientCountRequest {
    private UUID sessionId;
    private int numberOfPatients;

    // Getters and Setters
    public UUID getSessionId() { return sessionId; }
    public void setSessionId(UUID sessionId) { this.sessionId = sessionId; }

    public int getNumberOfPatients() { return numberOfPatients; }
    public void setNumberOfPatients(int numberOfPatients) { this.numberOfPatients = numberOfPatients; }
}
