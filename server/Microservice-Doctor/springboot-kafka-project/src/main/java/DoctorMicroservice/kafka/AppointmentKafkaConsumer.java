// package DoctorMicroservice.kafka;


// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.kafka.annotation.KafkaListener;
// import org.springframework.stereotype.Service;

// import DoctorMicroservice.dto.ScheduleSlotDto;
// import DoctorMicroservice.service.ScheduleSlotService;
// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class AppointmentKafkaConsumer {

//     private static final Logger LOGGER = LoggerFactory.getLogger(AppointmentKafkaConsumer.class);
//     private final ScheduleSlotService scheduleSlotService;

//     @KafkaListener(topics = "appointment", containerFactory = "scheduleSlotKafkaListenerContainerFactory")
//     public void update(ScheduleSlotDto scheduleSlotDto) {
//         LOGGER.info("Updated appointment status to booked", scheduleSlotDto);
//         scheduleSlotService.updateScheduleSlot(scheduleSlotDto);
//     }
// }
