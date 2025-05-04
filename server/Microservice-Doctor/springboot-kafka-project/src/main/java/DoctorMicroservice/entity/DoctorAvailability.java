package DoctorMicroservice.entity;



import java.util.Date;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "doctor_availability")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DoctorAvailability {
    @Id
    @Column(name = "session_id", nullable = false)
    private UUID session_id;

    //@ManyToOne(fetch = FetchType.LAZY)
    @Column(name = "doctor_id", nullable = false)
    private UUID doctor_id;

    @Column(name = "start_time", nullable = false, columnDefinition = "TIMESTAMP")
    private Date from;

    @Column(name = "end_time", nullable = false, columnDefinition = "TIMESTAMP")
    private Date to;

    @Column(name = "count",nullable = false)
    private int number_of_patients;

}