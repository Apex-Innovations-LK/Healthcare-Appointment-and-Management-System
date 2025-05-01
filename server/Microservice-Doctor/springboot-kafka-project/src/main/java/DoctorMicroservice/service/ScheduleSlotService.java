package DoctorMicroservice.service;

import DoctorMicroservice.dto.ScheduleSlotDto;

public interface ScheduleSlotService {

    ScheduleSlotDto rejectScheduleSlot(ScheduleSlotDto scheduleSlotDto);
}
