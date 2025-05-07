package DoctorMicroservice.service;

import java.util.List;

import DoctorMicroservice.dto.ScheduleSlotDto;
import DoctorMicroservice.dto.ScheduleSlotSearchRequest;

public interface ScheduleSlotService {

    ScheduleSlotDto rejectScheduleSlot(ScheduleSlotDto scheduleSlotDto);
    ScheduleSlotDto updateScheduleSlot(ScheduleSlotDto scheduleSlotDto);
    List<ScheduleSlotDto> getSlotsByDoctorAndDate(ScheduleSlotSearchRequest request);
}
