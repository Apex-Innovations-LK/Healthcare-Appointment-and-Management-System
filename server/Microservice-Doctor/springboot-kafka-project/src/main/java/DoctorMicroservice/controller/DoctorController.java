package DoctorMicroservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import DoctorMicroservice.dto.DoctorAvailabilityDto;
import DoctorMicroservice.dto.ScheduleSlotDto;
import DoctorMicroservice.dto.ScheduleSlotSearchRequest;
import DoctorMicroservice.entity.DoctorAvailability;
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
    public ResponseEntity<DoctorAvailabilityDto> addSession(@RequestBody DoctorAvailabilityDto doctorSessionDto){
        DoctorAvailabilityDto savedDocAvailability = doctorSessionService.addDoctorSession(doctorSessionDto);
        return new ResponseEntity<>(savedDocAvailability, HttpStatus.CREATED);
    };

    // getScheduleSlots for a date REST API
    @PostMapping("/getScheduleSlotsByDate")
    public ResponseEntity<List<ScheduleSlotDto>> getScheduleSlotsByDate(
            @RequestBody ScheduleSlotSearchRequest request) {
        List<ScheduleSlotDto> slots = scheduleSlotService.getSlotsByDoctorAndDate(request);
        return new ResponseEntity<>(slots, HttpStatus.OK);
    }
    
    // getSessionsByDate for a date REST API
    @PostMapping("/getSessionsByDateAndDocId")
    public ResponseEntity<List<DoctorAvailabilityDto>> getSessionsByDate(@RequestBody ScheduleSlotSearchRequest request) {
        List<DoctorAvailabilityDto> sessions = doctorSessionService.getSessions(request);
        return new ResponseEntity<>(sessions, HttpStatus.OK);
    }


    //rejectAppointment REST API
    @PostMapping("/rejectAppointment")
    public ResponseEntity<ScheduleSlotDto> rejectAppointment(@RequestBody ScheduleSlotDto scheduleSlotDto){
        ScheduleSlotDto rejectedAppointment = scheduleSlotService.rejectScheduleSlot(scheduleSlotDto);
        return new ResponseEntity<>(rejectedAppointment, HttpStatus.OK);
    };

}

// package HealthcareManagementSystemTest1.doctorFunctionality.controller;
