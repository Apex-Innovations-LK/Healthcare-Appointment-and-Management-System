package DoctorMicroservice.entity;


import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "schedule_slot")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleSlot {
    @Id
    @Column(name = "slot_id", nullable = false) 
    private UUID slotId; // assigned at time of setting doctorAvailability

    //@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DoctorSession_id", referencedColumnName = "DoctorSession_id", nullable = false)
    private UUID session_id;

    @Column(name = "status")
    private String status;

}