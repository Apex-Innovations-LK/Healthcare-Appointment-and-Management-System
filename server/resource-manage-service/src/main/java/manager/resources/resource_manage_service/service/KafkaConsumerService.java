package manager.resources.resource_manage_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
//import com.team06.appointment_service.dto.DoctorKafkaEvent;
//import com.team06.appointment_service.dto.ScheduleSlotDto;
//import com.team06.appointment_service.model.Appointment;
//import com.team06.appointment_service.model.Availibility;
//import com.team06.appointment_service.repo.AppointmentRepo;
//import com.team06.appointment_service.repo.AvailibilityRepo;
import manager.resources.resource_manage_service.model.Resource;
import manager.resources.resource_manage_service.model.ResourceAllocation;
import manager.resources.resource_manage_service.model.SheduledInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class KafkaConsumerService {
    private static final Logger logger = LoggerFactory.getLogger(KafkaConsumerService.class);

    private final ResourceAllocationService resourceAllocationService;
    private final ResourceService resourceService;

    Random random = new Random();

    @Autowired
    private ObjectMapper objectMapper;

    public KafkaConsumerService(ResourceAllocationService resourceAllocationService , ResourceService resourceService) {
        this.resourceAllocationService = resourceAllocationService;
        this.resourceService = resourceService;
    }

    @KafkaListener(topics = "${kafka.topic.schedule-details}", groupId ="${spring.kafka.consumer.group-id}")
    public void consumeScheduleSlot(String message, Acknowledgment acknowledgment) {
        try {
            logger.info("Received message: {}", message);
            SheduledInfo scheduleSlotDto = objectMapper.readValue(message, SheduledInfo.class);
            List<Long> busyResourceIds = resourceAllocationService.getBusyResources(scheduleSlotDto.getFrom(),scheduleSlotDto.getTo());

            List<Resource> allResources = resourceService.findAllResources();
            List<Resource> availableResources = allResources.stream()
                    .filter(resource -> !busyResourceIds.contains(resource.getResourceId()))  // Exclude busy resources
                    .filter(resource -> "Room".equalsIgnoreCase(resource.getType()))         // Include only type "Rooms"
                    .collect(Collectors.toList());
            if(!availableResources.isEmpty()){
                Resource allocatedResource = availableResources.get(random.nextInt(availableResources.size()));
                ResourceAllocation newResourceAllocation = new ResourceAllocation(scheduleSlotDto.getSession_id() ,allocatedResource.getResourceId() ,scheduleSlotDto.getFrom().toLocalDateTime() , scheduleSlotDto.getTo().toLocalDateTime());
                resourceAllocationService.addResourceAllocation(newResourceAllocation);
            }else {
                ResourceAllocation newResourceAllocation = new ResourceAllocation(scheduleSlotDto.getSession_id() ,null ,scheduleSlotDto.getFrom().toLocalDateTime() , scheduleSlotDto.getTo().toLocalDateTime());
                resourceAllocationService.addResourceAllocation(newResourceAllocation);
            }


            // Acknowledge the message after successful processing
            acknowledgment.acknowledge();
            logger.info("User event processed successfully: {}", scheduleSlotDto);
            logger.info("Busy resources are: {}", availableResources);
            System.out.println(scheduleSlotDto);

        } catch (Exception e) {
            logger.error("Error processing Kafka message: {}", e.getMessage(), e);
            // In case of error, we could implement retry logic here or send to DLQ
            // For now, we'll still acknowledge to prevent endless retries
            acknowledgment.acknowledge();
        }
    }
}
