package com.team06.appointment_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team06.appointment_service.dto.DoctorKafkaEvent;
import com.team06.appointment_service.dto.ScheduleSlotDto;
import com.team06.appointment_service.model.Appointment;
import com.team06.appointment_service.model.Availibility;
import com.team06.appointment_service.repo.AppointmentRepo;
import com.team06.appointment_service.repo.AvailibilityRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class KafkaConsumerService {
    private static final Logger logger = LoggerFactory.getLogger(KafkaConsumerService.class);

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AvailibilityRepo availibilityRepo;

    @Autowired
    private AppointmentRepo appointmentRepo;

    @KafkaListener(topics = "${kafka.topic.availability-settled}", groupId ="${spring.kafka.consumer.group-id}")
    public void consueAvailabilitySettledEvent(String message, Acknowledgment acknowledgment) {
        try {
            logger.info("Received message: {}", message);
            DoctorKafkaEvent doctorEvent = objectMapper.readValue(message, DoctorKafkaEvent.class);

            if ("AVAILABILITY_SETTLED".equals(doctorEvent.getEventType())) {
                processAvailabilitySettledEvent(doctorEvent);
            } else {
                logger.warn("Unknown event type: {}", doctorEvent.getEventType());
            }

            // Acknowledge the message after successful processing
            acknowledgment.acknowledge();
            logger.info("User event processed successfully: {}", doctorEvent);

        } catch (Exception e) {
            logger.error("Error processing Kafka message: {}", e.getMessage(), e);
            // In case of error, we could implement retry logic here or send to DLQ
            // For now, we'll still acknowledge to prevent endless retries
            acknowledgment.acknowledge();
        }
    }

    @KafkaListener(topics = "${kafka.topic.schedule-slot}", groupId ="${spring.kafka.consumer.group-id}")
    public void consumeScheduleSlot(String message, Acknowledgment acknowledgment) {
        try {
            logger.info("Received message: {}", message);
            ScheduleSlotDto scheduleSlotDto = objectMapper.readValue(message, ScheduleSlotDto.class);

            processScheduleSlot(scheduleSlotDto);

            // Acknowledge the message after successful processing
            acknowledgment.acknowledge();
            logger.info("User event processed successfully: {}", scheduleSlotDto);

        } catch (Exception e) {
            logger.error("Error processing Kafka message: {}", e.getMessage(), e);
            // In case of error, we could implement retry logic here or send to DLQ
            // For now, we'll still acknowledge to prevent endless retries
            acknowledgment.acknowledge();
        }
    }

    @KafkaListener(topics = "${kafka.topic.appointment-rejected}", groupId ="${spring.kafka.consumer.group-id}")
    public void consumeAppointmentRejected(String message, Acknowledgment acknowledgment) {
        try {
            logger.info("Received message: {}", message);
            ScheduleSlotDto scheduleSlotDto = objectMapper.readValue(message, ScheduleSlotDto.class);

            processAppointmentRejectedEvent(scheduleSlotDto);

            // Acknowledge the message after successful processing
            acknowledgment.acknowledge();
            logger.info("User event processed successfully: {}", scheduleSlotDto);

        } catch (Exception e) {
            logger.error("Error processing Kafka message: {}", e.getMessage(), e);
            // In case of error, we could implement retry logic here or send to DLQ
            // For now, we'll still acknowledge to prevent endless retries
            acknowledgment.acknowledge();
        }
    }

    private void processAppointmentRejectedEvent(ScheduleSlotDto scheduleSlotDto) {
        appointmentRepo.updateAppointmentTable(scheduleSlotDto.getSlotId());
        logger.info("Availability settled to database: {}");
    }

    private void processAvailabilitySettledEvent(DoctorKafkaEvent doctorEvent) {
        Availibility availibility = new Availibility();
        availibility.setSession_id(doctorEvent.getSession_id());
        availibility.setDoctor_id(doctorEvent.getDoctor_id());
        availibility.setFrom(doctorEvent.getFrom());
        availibility.setTo(doctorEvent.getTo());
        availibility.setNumber_of_patients(doctorEvent.getNumber_of_patients());

        availibilityRepo.save(availibility);
        logger.info("Availability settled to database: {}", availibility);
    }

    private void processScheduleSlot(ScheduleSlotDto scheduleSlotDto) {
        Appointment appointment = new Appointment();
        appointment.setSlotId(scheduleSlotDto.getSlotId());
        appointment.setSession_id(scheduleSlotDto.getSession_id());
        appointment.setStatus(scheduleSlotDto.getStatus());

        appointmentRepo.save(appointment);
        logger.info("Availability settled to database: {}", appointment);
    }
}