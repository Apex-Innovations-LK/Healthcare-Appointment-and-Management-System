package DoctorMicroservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import DoctorMicroservice.dto.DoctorDto;
import DoctorMicroservice.dto.DoctorSessionDto;
import DoctorMicroservice.service.DoctorService;
import DoctorMicroservice.service.DoctorSessionService;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;
    private final DoctorSessionService doctorSessionService;

    //addDoctor REST API
    @PostMapping("/addDoc")
    public ResponseEntity<DoctorDto> addDoctor(@RequestBody DoctorDto doctorDto){
        DoctorDto savedDoc = doctorService.addDoctor(doctorDto);
        return new ResponseEntity<>(savedDoc, HttpStatus.CREATED);
    };

    //addDoctorAvailability REST API
    @PostMapping("/addSession")
    public ResponseEntity<DoctorSessionDto> addDoctor(@RequestBody DoctorSessionDto doctorSessionDto){
        DoctorSessionDto savedDocAvailability = doctorSessionService.addDoctorSession(doctorSessionDto);
        return new ResponseEntity<>(savedDocAvailability, HttpStatus.CREATED);
    };

}

// package HealthcareManagementSystemTest1.doctorFunctionality.controller;
