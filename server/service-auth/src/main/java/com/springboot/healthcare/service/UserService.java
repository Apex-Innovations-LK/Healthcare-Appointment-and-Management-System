package com.springboot.healthcare.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.springboot.healthcare.dto.AuthResponse;
import com.springboot.healthcare.dto.RegisterRequest;
import com.springboot.healthcare.dto.UserKafkaEvent;
import com.springboot.healthcare.exception.EmailAlreadyExistsException;
import com.springboot.healthcare.exception.UsernameAlreadyExistsException;
import com.springboot.healthcare.model.Doctor;
import com.springboot.healthcare.model.Patient;
import com.springboot.healthcare.model.Staff;
import com.springboot.healthcare.model.Users;
import com.springboot.healthcare.repo.DoctorRepo;
import com.springboot.healthcare.repo.PatientRepo;
import com.springboot.healthcare.repo.StaffRepo;
import com.springboot.healthcare.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private DoctorRepo doctorRepo;

    @Autowired
    private StaffRepo staffRepo;

    @Autowired
    private PatientRepo patientRepo;

     @Autowired
     private AuthenticationManager authenticationManager;

     @Autowired
     private JWTService jwtService;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @Autowired
    private ObjectMapper objectMapper;


    private final BCryptPasswordEncoder encoder =  new BCryptPasswordEncoder(12);

    public AuthResponse register(RegisterRequest request) throws JsonProcessingException {
        Users user = new Users();
        if(userRepo.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists");
        }
        if(userRepo.existsByUsername(request.getUsername())) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }
        user.setPassword(encoder.encode(request.getPassword()));
        if (request.getRole().equals("DOCTOR") || request.getRole().equals("STAFF")) {
            user.setStatus("PENDING");
        } else {
            user.setStatus("APPROVED");
        }
        user.setFirst_name(request.getFirst_name());
        user.setLast_name(request.getLast_name());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setRole(request.getRole());
        user.setPhone_number(request.getPhone_number());
        user.setDate_of_birth(request.getDate_of_birth());
        user.setGender(request.getGender());

        Users savedUser = userRepo.save(user);
        switch(request.getRole().toUpperCase()) {
            case "DOCTOR":
                Doctor doctor = new Doctor();
                doctor.setUser(savedUser);
                doctor.setSpeciality(request.getSpeciality());
                doctor.setLicense_number(request.getLicense_number());
                doctorRepo.save(doctor);
                break;

                case "STAFF":
                    Staff staff = new Staff();
                    staff.setUser(user);
                    staffRepo.save(staff);
                    break;

                case "PATIENT":
                    Patient patient = new Patient();
                    patient.setUser(user);
                    patientRepo.save(patient);
                    break;

            default:
                throw new IllegalArgumentException("Invalid role specified.");
        }
        String token = jwtService.generateToken(user.getUsername(), user.getRole());

//        String kafkaMessage = String.format(
//                "{\"userId\":\"%s\", \"username\":\"%s\", \"email\":\"%s\", \"role\":\"%s\"}",
//                savedUser.getId().toString(),
//                savedUser.getUsername(),
//                savedUser.getEmail(),
//                savedUser.getRole()
//        );
//
//        kafkaProducerService.sendMessage(kafkaMessage);

//        UserKafkaEvent event = new UserKafkaEvent(
//                savedUser.getId(),
//                savedUser.getUsername(),
//                savedUser.getEmail(),
//                savedUser.getRole()
//        );
//
//        kafkaProducerService.sendMessage(event);


        return new AuthResponse(token, user.getUsername(), user.getRole(), user.getStatus(),"Registration successful");
    }

     public AuthResponse verify(Users user) {
         try {
             Authentication authentication =
                     authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
             if (authentication.isAuthenticated()) {
                 Users loggedUser = userRepo.findByUsername(user.getUsername()).orElse(null);
                 user.setRole(loggedUser.getRole());
                 user.setStatus(loggedUser.getStatus());
                 String loginToken = jwtService.generateToken(user.getUsername(), user.getRole());
                 return new AuthResponse(loginToken, user.getUsername(), user.getRole(), user.getStatus(), "Verification successful");
             }

         } catch (Exception e) {
             e.printStackTrace();
         }
         return new AuthResponse("", "", "", "", "Verification failed");
     }


    public Optional<Users> getUserByUsername(String username) {
        return userRepo.findByUsername(username);
    }
}
