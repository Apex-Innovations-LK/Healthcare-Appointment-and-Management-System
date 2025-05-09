// package DoctorMicroservice.entity;


// import java.util.UUID;

// import jakarta.persistence.Column;
// import jakarta.persistence.Entity;
// import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.Table;
// import lombok.AllArgsConstructor;
// import lombok.Getter;
// import lombok.NoArgsConstructor;
// import lombok.Setter;

// @Entity
// @Table(name = "schedule_slot")
// @Getter
// @Setter
// @AllArgsConstructor
// @NoArgsConstructor
// public class ScheduleSlot {
//     @Id
//     @Column(name = "slot_id", nullable = false) 
//     private UUID slotId; // assigned at time of setting doctorAvailability

//     //@ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "DoctorSession_id", referencedColumnName = "DoctorSession_id", nullable = false)
//     private UUID session_id;

//     @Column(name = "status")
//     private String status;

// }

package DoctorMicroservice.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "schedule_slot")
public class ScheduleSlot {
    @Id
    @Column(name = "slot_id", nullable = false) 
    private UUID slotId; // assigned at time of setting doctorAvailability

    //@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", referencedColumnName = "session_id", nullable = false)
    private UUID session_id;

    @Column(name = "status")
    private String status;

    // No-argument constructor
    public ScheduleSlot() {
    }

    // All-argument constructor
    public ScheduleSlot(UUID slotId, UUID session_id, String status) {
        this.slotId = slotId;
        this.session_id = session_id;
        this.status = status;
    }

    // Getter and Setter for slotId
    public UUID getSlotId() {
        return slotId;
    }

    public void setSlotId(UUID slotId) {
        this.slotId = slotId;
    }

    // Getter and Setter for session_id
    public UUID getSession_id() {
        return session_id;
    }

    public void setSession_id(UUID session_id) {
        this.session_id = session_id;
    }

    // Getter and Setter for status
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}