package DoctorMicroservice.mapper;

import DoctorMicroservice.dto.ScheduleSlotDto;
import DoctorMicroservice.entity.ScheduleSlot;

public class ScheduleSlotMapper {
    public static ScheduleSlotDto mapToScheduleSlotDto(ScheduleSlot scheduleSlot){
        return new ScheduleSlotDto(
                scheduleSlot.getSlotId(),
                scheduleSlot.getDoctorSessionId(),
                scheduleSlot.getStartTime(),
                scheduleSlot.getEndTime(),
                scheduleSlot.getStatus()
        );
    }
    public static Patient mapToPatient(PatientDto patientDto){
        return new Patient(
                patientDto.getPatientId()
        );
    }
}
