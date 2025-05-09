package manager.resources.resource_manage_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
//import com.team06.appointment_service.dto.DoctorKafkaEvent;
//import com.team06.appointment_service.dto.ScheduleSlotDto;
//import com.team06.appointment_service.model.Appointment;
//import com.team06.appointment_service.model.Availibility;
//import com.team06.appointment_service.repo.AppointmentRepo;
//import com.team06.appointment_service.repo.AvailibilityRepo;
import manager.resources.resource_manage_service.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
public class KafkaConsumerService {
    private static final Logger logger = LoggerFactory.getLogger(KafkaConsumerService.class);

    private final ResourceAllocationService resourceAllocationService;
    private final ResourceService resourceService;
    private final UserService userService;
    private final StaffAllocationService staffAllocationService;

    Random random = new Random();

    @Autowired
    private ObjectMapper objectMapper;

    public KafkaConsumerService(ResourceAllocationService resourceAllocationService , ResourceService resourceService , UserService userService , StaffAllocationService staffAllocationService) {
        this.resourceAllocationService = resourceAllocationService;
        this.resourceService = resourceService;
        this.userService = userService;
        this.staffAllocationService = staffAllocationService;
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

            User doctor = userService.getUserById(scheduleSlotDto.getDoctor_id());
            User staffMember = userService.getUserById(scheduleSlotDto.getStaff_id());
            float scheduleTime = Duration.between(scheduleSlotDto.getFrom(), scheduleSlotDto.getTo()).toMinutes() / 60.0f;
            float idle_time = ThreadLocalRandom.current().nextFloat() * scheduleTime;
            float activeTime = scheduleTime - idle_time;
            float utilization = (activeTime / scheduleTime) * 100.0f;
            float overtime = 0;
            String status;
            if (utilization >= 80.0f) {
                status = "High";
            } else if (utilization >= 50.0f) {
                status = "Normal";
            } else {
                status = "Low";
            }

            StaffAllocation newStaffAllocationForDoc = new StaffAllocation(doctor.getId(), doctor.getFirstName()+" "+doctor.getLastName(),"Doctor", Date.from(scheduleSlotDto.getFrom().toInstant()) , scheduleTime , overtime , idle_time , activeTime , utilization , status );
            staffAllocationService.addStaffAllocation(newStaffAllocationForDoc);
            StaffAllocation newStaffAllocationForStaff = new StaffAllocation(staffMember.getId(), staffMember.getFirstName()+" "+staffMember.getLastName(),"Staff", Date.from(scheduleSlotDto.getFrom().toInstant()) , scheduleTime , overtime , idle_time , activeTime , utilization , status );
            staffAllocationService.addStaffAllocation(newStaffAllocationForStaff);

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
