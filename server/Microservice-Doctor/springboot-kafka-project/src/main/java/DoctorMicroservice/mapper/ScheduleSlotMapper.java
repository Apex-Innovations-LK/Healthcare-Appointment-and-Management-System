package DoctorMicroservice.mapper;


import org.springframework.stereotype.Component;

import DoctorMicroservice.dto.ScheduleSlotDto;
import DoctorMicroservice.entity.ScheduleSlot;

@Component
public class ScheduleSlotMapper {


    public ScheduleSlot mapToScheduleSlot(ScheduleSlotDto dto) {

        
        return new ScheduleSlot(
                dto.getSlotId(),
                dto.getSession_id(),
                dto.getStatus()
        );
    }
    public static ScheduleSlotDto mapToScheduleSlotDto(ScheduleSlot scheduleSlot) {
        return new ScheduleSlotDto(
                scheduleSlot.getSlotId(),
                scheduleSlot.getSession_id(),
                scheduleSlot.getStatus()
        );
    }
}
