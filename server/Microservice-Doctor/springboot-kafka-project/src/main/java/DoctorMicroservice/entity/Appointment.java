// package DoctorMicroservice.entity;


// import jakarta.persistence.*;
// import lombok.AllArgsConstructor;
// import lombok.Getter;
// import lombok.NoArgsConstructor;
// import lombok.Setter;

// @Entity
// @Table(name = "appointments")
// @Getter
// @Setter
// @AllArgsConstructor
// @NoArgsConstructor
// public class Appointment {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     @Column(name = "appointment_id", nullable = false)
//     private Long appointmentId;

//     @OneToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "slot_id", referencedColumnName = "slot_id", nullable = false)
//     private ScheduleSlot slotId;

//     @OneToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "patient_id", referencedColumnName = "patient_id", nullable = false)
//     private Patient patient;

//     @Column(name = "status", nullable = false)
//     private String status;

//     @Column(name = "appointment_type", nullable = false)
//     private String appointmentType;

//     @Column(name = "notes")
//     private String notes;

// }