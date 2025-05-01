package DoctorMicroservice.mapper;


import DoctorMicroservice.dto.ScheduleSlotDto;
import DoctorMicroservice.entity.DoctorSession;
import DoctorMicroservice.entity.ScheduleSlot;
import DoctorMicroservice.exception.ResourceNotFoundException;
import DoctorMicroservice.repository.DoctorSessionRepository;

public class ScheduleSlotMapper {

    private DoctorSessionRepository doctorSessionRepository;

    public ScheduleSlot mapToScheduleSlot(ScheduleSlotDto dto) {

        DoctorSession doctorSession = doctorSessionRepository.findById(dto.getSessionId())
                                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        return new ScheduleSlot(
                dto.getSlotId(),
                doctorSession,
                dto.getStatus()
        );
    }
    public static ScheduleSlotDto mapToScheduleSlotDto(ScheduleSlot scheduleSlot) {
        return new ScheduleSlotDto(
                scheduleSlot.getSlotId(),
                scheduleSlot.getSession().getDoctorSessionId(),
                scheduleSlot.getStatus()
        );
    }
}
