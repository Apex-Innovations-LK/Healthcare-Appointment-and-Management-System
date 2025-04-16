package com.springboot.springsecurity.service;

import com.springboot.springsecurity.dto.AuthResponse;
import com.springboot.springsecurity.model.Doctor;
import com.springboot.springsecurity.model.Patient;
import com.springboot.springsecurity.model.Staff;
import com.springboot.springsecurity.model.Users;
import com.springboot.springsecurity.repo.DoctorRepo;
import com.springboot.springsecurity.repo.PatientRepo;
import com.springboot.springsecurity.repo.StaffRepo;
import com.springboot.springsecurity.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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
        user.setStatus("PENDING");
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

        String token =  jwtService.generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername(), "Registration successful");
    }

     public AuthResponse verify(Users user) {
         Authentication authentication =
                 authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
         if(authentication.isAuthenticated()) {
             String loginToken =  jwtService.generateToken(user.getUsername());
             return new AuthResponse(loginToken, user.getUsername(), "Verification successful");
         }
         return new AuthResponse("", "", "Verification failed");
     }
}
