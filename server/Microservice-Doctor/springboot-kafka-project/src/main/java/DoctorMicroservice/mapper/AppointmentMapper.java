package DoctorMicroservice.mapper;

import DoctorMicroservice.dto.AppointmentDto;
import DoctorMicroservice.entity.Appointment;
import DoctorMicroservice.entity.Patient;
import DoctorMicroservice.entity.ScheduleSlot;
import DoctorMicroservice.exception.ResourceNotFoundException;
import DoctorMicroservice.repository.PatientRepository;
import DoctorMicroservice.repository.ScheduleSlotRepository;


public class AppointmentMapper {

    private PatientRepository patientRepository;
    private ScheduleSlotRepository scheduleSlotRepository;

    public AppointmentDto mapToAppointmentDto(Appointment appointment) {
        return new AppointmentDto(
                appointment.getAppointmentId(),
                appointment.getSlotId().getSlotId(),
                appointment.getPatient().getPatientId(),
                appointment.getStatus(),
                appointment.getAppointmentType(),
                appointment.getNotes()
        );
    }

    public Appointment mapToAppointment(AppointmentDto appointmentDto) {

        Patient patient = patientRepository.findById(appointmentDto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        ScheduleSlot slot = scheduleSlotRepository.findById(appointmentDto.getSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));

        return new Appointment(
                appointmentDto.getAppointmentId(),
                slot,
                patient,
                appointmentDto.getStatus(),
                appointmentDto.getAppointmentType(),
                appointmentDto.getNotes()
        );
    }

}