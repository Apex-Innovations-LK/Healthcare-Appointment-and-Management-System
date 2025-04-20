package com.springboot.healthcare.service;

import com.springboot.healthcare.dto.AuthResponse;
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

    private final BCryptPasswordEncoder encoder =  new BCryptPasswordEncoder(12);

    public AuthResponse register(Users user) {
        user.setPassword(encoder.encode(user.getPassword()));
        if (user.getRole().equals("DOCTOR") || user.getRole().equals("STAFF")) {
            user.setStatus("PENDING");
        } else {
            user.setStatus("APPROVED");
        }
        userRepo.save(user);
        switch(user.getRole().toUpperCase()) {
            case "DOCTOR":
                Doctor doctor = new Doctor();
                doctor.setUser(user);
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
        return new AuthResponse(token, user.getUsername(), user.getRole(), user.getStatus(),"Registration successful");
    }

     public AuthResponse verify(Users user) {
         Authentication authentication =
                 authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
         if(authentication.isAuthenticated()) {
             Users loggedUser = userRepo.findByUsername(user.getUsername()).orElse(null);
             user.setRole(loggedUser.getRole());
             user.setStatus(loggedUser.getStatus());
             String loginToken =  jwtService.generateToken(user.getUsername(), user.getRole());
             return new AuthResponse(loginToken, user.getUsername(),  user.getRole(), user.getStatus(),"Verification successful");
         }
         return new AuthResponse("", "","", "", "Verification failed");
     }

//
//    public Optional<Users> getUserById(UUID id) {
//        return userRepo.findById(id);
//    }

    public Optional<Users> getUserByUsername(String username) {
        return userRepo.findByUsername(username);
    }





}
