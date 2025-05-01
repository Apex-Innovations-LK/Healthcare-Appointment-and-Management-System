package DoctorMicroservice.service.impl;

import DoctorMicroservice.dto.ScheduleSlotDto;
import DoctorMicroservice.service.ScheduleSlotService;
import DoctorMicroservice.mapper.ScheduleSlotMapper;
import DoctorMicroservice.repository.ScheduleSlotRepository;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ScheduleSlotServiceImpl implements ScheduleSlotService {

    private final ScheduleSlotRepository scheduleSlotRepository;
    private final ScheduleSlotMapper scheduleSlotMapper;


    @Override
    public ScheduleSlotDto rejectSceduleSlot(ScheduleSlotDto scheduleSlotDto) {
        // Logic to reject the schedule slot
        return scheduleSlotDto;
    }

}
