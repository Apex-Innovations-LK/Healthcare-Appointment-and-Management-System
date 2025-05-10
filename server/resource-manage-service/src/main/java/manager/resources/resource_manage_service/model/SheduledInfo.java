package manager.resources.resource_manage_service.model;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Date;
import java.util.UUID;

public class SheduledInfo {

    private UUID session_id;
    private UUID doctor_id;
    private UUID staff_id;
    private OffsetDateTime from;
    private OffsetDateTime to;

    public SheduledInfo() {}

    public SheduledInfo(UUID session_id, UUID doctor_id, UUID staff_id, OffsetDateTime from, OffsetDateTime to) {
        this.session_id = session_id;
        this.doctor_id = doctor_id;
        this.staff_id = staff_id;
        this.from = from;
        this.to = to;
    }

    public OffsetDateTime getTo() {
        return to;
    }

    public void setTo(OffsetDateTime to) {
        this.to = to;
    }

    public UUID getSession_id() {
        return session_id;
    }

    public void setSession_id(UUID session_id) {
        this.session_id = session_id;
    }

    public UUID getDoctor_id() {
        return doctor_id;
    }

    public void setDoctor_id(UUID doctor_id) {
        this.doctor_id = doctor_id;
    }

    public UUID getStaff_id() {
        return staff_id;
    }

    public void setStaff_id(UUID staff_id) {
        this.staff_id = staff_id;
    }

    public OffsetDateTime getFrom() {
        return from;
    }

    public void setFrom(OffsetDateTime from) {
        this.from = from;
    }

    @Override
    public String toString() {
        return "SheduledInfo{" +
                "session_id=" + session_id +
                ", doctor_id=" + doctor_id +
                ", staff_id=" + staff_id +
                ", from=" + from +
                ", to=" + to +
                '}';
    }
}
