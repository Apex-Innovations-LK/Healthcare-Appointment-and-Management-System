package DoctorMicroservice.service.impl;

import DoctorMicroservice.dto.ScheduleSlotDto;
import DoctorMicroservice.entity.ScheduleSlot;
import DoctorMicroservice.service.ScheduleSlotService;
import DoctorMicroservice.mapper.ScheduleSlotMapper;
import DoctorMicroservice.repository.ScheduleSlotRepository;
import lombok.RequiredArgsConstructor;
import lombok.Service;
import lombok.transaction.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ScheduleSlotServiceImpl implements ScheduleSlotService {

    private final ScheduleSlotRepository scheduleSlotRepository;
    private final ScheduleSlotMapper scheduleSlotMapper;


    @Override
    public void rejectScheduleSlot(ScheduleSlotDto scheduleSlotDto) {
        ScheduleSlot slot = scheduleSlotRepository.findById(scheduleSlotDto.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        slot.setStatus("rejected");
        scheduleSlotRepository.save(slot);
    }

}
