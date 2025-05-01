package com.springboot.healthcare.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.healthcare.model.Doctor;
import com.springboot.healthcare.repo.DoctorRepo;

@RestController
@RequestMapping("/api/auth/doctors")
@CrossOrigin(origins = "*") // allow requests from frontend
public class DoctorController {

    @Autowired
    private DoctorRepo doctorRepository;

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }
}
