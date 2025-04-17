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

import java.util.UUID;

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
        Users savedUser = userRepo.save(user);

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
        user.setId(savedUser.getId());
        String token = jwtService.generateToken(user.getUsername(), user.getId(), user.getRole());
        return new AuthResponse(token, user.getUsername(), "Registration successful");
    }

     public AuthResponse verify(Users user) {
         Authentication authentication =
                 authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
         if(authentication.isAuthenticated()) {
             Users loggedUser = userRepo.findByusername(user.getUsername());
             user.setId(loggedUser.getId());
             user.setRole(loggedUser.getRole());
             String loginToken =  jwtService.generateToken(user.getUsername(), user.getId(), user.getRole());
             return new AuthResponse(loginToken, user.getUsername(), "Verification successful");
         }
         return new AuthResponse("", "", "Verification failed");
     }
}
