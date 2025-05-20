package DoctorMicroservice.dto;

import java.util.Date;
import java.util.UUID;

public class UpdateTimeRequest {
    private UUID sessionId;
    private Date from;
    private Date to;

    // Getters and Setters
    public UUID getSessionId() { return sessionId; }
    public void setSessionId(UUID sessionId) { this.sessionId = sessionId; }

    public Date getFrom() { return from; }
    public void setFrom(Date from) { this.from = from; }

    public Date getTo() { return to; }
    public void setTo(Date to) { this.to = to; }
}
