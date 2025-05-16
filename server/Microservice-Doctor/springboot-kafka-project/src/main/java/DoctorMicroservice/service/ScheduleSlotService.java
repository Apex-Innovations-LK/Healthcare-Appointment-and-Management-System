package DoctorMicroservice.service;

import java.util.List;

import DoctorMicroservice.dto.ScheduleSlotBySessionId;
import DoctorMicroservice.dto.ScheduleSlotDto;

public interface ScheduleSlotService {

    ScheduleSlotDto rejectScheduleSlot(ScheduleSlotDto scheduleSlotDto);
    ScheduleSlotDto updateScheduleSlot(ScheduleSlotDto scheduleSlotDto);

    //List<ScheduleSlotDto> getSlotsByDoctorAndDate(ScheduleSlotSearchRequest request);
    List<ScheduleSlotDto> getSlotsOfSession(ScheduleSlotBySessionId request);
   
    
}
