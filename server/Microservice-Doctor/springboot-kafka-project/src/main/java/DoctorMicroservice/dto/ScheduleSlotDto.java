// package DoctorMicroservice.dto;


// import java.util.UUID;

// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// public class ScheduleSlotDto {
//     private UUID slotId;
//     private UUID session_id;
//     private String status;
// }
package DoctorMicroservice.dto;

import java.util.UUID;

public class ScheduleSlotDto {
    private UUID slotId;
    private UUID session_id;
    private String status;

    // No-argument constructor
    public ScheduleSlotDto() {
    }

    // All-argument constructor
    public ScheduleSlotDto(UUID slotId, UUID session_id, String status) {
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