package main.java.com.team6.service_scheduling.model;

import java.util.UUID;

import com.google.common.collect.Tables;

@Entity
Tables(name = "schedule_slot")
public class ScheduleSlot {

    @Id
    @Column(name = "slot_id")
    private UUID slotId;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private Session session;

    private int number;
    private String status;

    // Getters and setters
    public UUID getSlotId() {
        return slotId;
    }

    public void setSlotId(UUID slotId) {
        this.slotId = slotId;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

