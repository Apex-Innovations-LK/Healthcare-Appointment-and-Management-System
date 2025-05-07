package DoctorMicroservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import DoctorMicroservice.dto.ScheduleSlotBySessionId;

import DoctorMicroservice.dto.DoctorAvailabilityDto;
import DoctorMicroservice.dto.ScheduleSlotDto;
import DoctorMicroservice.dto.ScheduleSlotSearchRequest;
import DoctorMicroservice.service.DoctorSessionService;
import DoctorMicroservice.service.ScheduleSlotService;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorSessionService doctorSessionService;
    private final ScheduleSlotService scheduleSlotService;

    // //addDoctor REST API
    // @PostMapping("/addDoc")
    // public ResponseEntity<DoctorDto> addDoctor(@RequestBody DoctorDto doctorDto){
    //     DoctorDto savedDoc = doctorService.addDoctor(doctorDto);
    //     return new ResponseEntity<>(savedDoc, HttpStatus.CREATED);
    // };

    //addDoctorAvailability REST API
    @PostMapping("/addAvailability")
    public ResponseEntity<DoctorAvailabilityDto> addSession(@RequestBody DoctorAvailabilityDto doctorSessionDto) {
        DoctorAvailabilityDto savedDocAvailability = doctorSessionService.addDoctorSession(doctorSessionDto);
        return new ResponseEntity<>(savedDocAvailability, HttpStatus.CREATED);
    };

    // @PostMapping("/updateSessionTime")
    // public ResponseEntity<DoctorAvailabilityDto> updateSessionTime(@RequestBody UpdateTimeRequest request) {
    //     DoctorAvailabilityDto updated = doctorSessionService.updateSessionTime(request);
    //     return new ResponseEntity<>(updated, HttpStatus.OK);
    // }

    @PutMapping("/updateAvailability")
    public ResponseEntity<DoctorAvailabilityDto> updateAvailability(@RequestBody DoctorAvailabilityDto updatedDto) {
        DoctorAvailabilityDto updated = doctorSessionService.updateAvailability(updatedDto);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    // @PostMapping("/updatePatientCount")
    // public ResponseEntity<DoctorAvailabilityDto> updatePatientCount(@RequestBody UpdatePatientCountRequest request) {
    //     DoctorAvailabilityDto updated = doctorSessionService.updatePatientCount(request);
    //     return new ResponseEntity<>(updated, HttpStatus.OK);
    // }

    // getScheduleSlots for a date REST API
    @PostMapping("/getScheduleSlotsByDate")
    public ResponseEntity<List<ScheduleSlotDto>> getScheduleSlotsByDate(
            @RequestBody ScheduleSlotSearchRequest request) {
        List<ScheduleSlotDto> slots = scheduleSlotService.getSlotsByDoctorAndDate(request);
        return new ResponseEntity<>(slots, HttpStatus.OK);
    }

    // getSessionsByDate for a date REST API
    @PostMapping("/getSessionsByDateAndDocId")
    public ResponseEntity<List<DoctorAvailabilityDto>> getSessionsByDate(
            @RequestBody ScheduleSlotSearchRequest request) {
        List<DoctorAvailabilityDto> sessions = doctorSessionService.getSessions(request);
        return new ResponseEntity<>(sessions, HttpStatus.OK);
    }

    //rejectAppointment REST API
    @PostMapping("/rejectAppointment")
    public ResponseEntity<ScheduleSlotDto> rejectAppointment(@RequestBody ScheduleSlotDto scheduleSlotDto) {
        ScheduleSlotDto rejectedAppointment = scheduleSlotService.rejectScheduleSlot(scheduleSlotDto);
        return new ResponseEntity<>(rejectedAppointment, HttpStatus.OK);
    };

    @DeleteMapping("/deleteSession")
    public ResponseEntity<String> deleteDoctorSession(@RequestBody DoctorAvailabilityDto request) {
        doctorSessionService.deleteDoctorSession(request.getSession_id());
        return ResponseEntity.ok("Doctor session deleted successfully.");
    }

    // getScheduleSlots for a date REST API
    @PostMapping("/getScheduleSlotsBySessionId")
    public ResponseEntity<List<ScheduleSlotDto>> getScheduleSlotsBySessionId(@RequestBody ScheduleSlotBySessionId request) {
        List<ScheduleSlotDto> slots = scheduleSlotService.getSlotsOfSession(request);
        return new ResponseEntity<>(slots, HttpStatus.OK);
    }

}

// package HealthcareManagementSystemTest1.doctorFunctionality.controller;
