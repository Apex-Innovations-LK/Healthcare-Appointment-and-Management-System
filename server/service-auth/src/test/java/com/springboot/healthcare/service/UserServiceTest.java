package com.springboot.healthcare.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.springboot.healthcare.dto.AuthResponse;
import com.springboot.healthcare.dto.RegisterRequest;
import com.springboot.healthcare.exception.EmailAlreadyExistsException;
import com.springboot.healthcare.exception.UsernameAlreadyExistsException;
import com.springboot.healthcare.model.Users;
import com.springboot.healthcare.repo.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock private UserRepo userRepo;
    @Mock private DoctorRepo doctorRepo;
    @Mock private StaffRepo staffRepo;
    @Mock private PatientRepo patientRepo;
    @Mock private JWTService jwtService;
    @Mock private KafkaProducerService kafkaProducerService;
    @Mock private AuthenticationManager authenticationManager;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ----------- SIGNUP TESTS ------------

    @Test
    void testRegisterPatientSuccess() throws JsonProcessingException {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("patient1");
        request.setFirst_name("Pat");
        request.setLast_name("Ient");
        request.setDate_of_birth(new Date());
        request.setGender("Male");
        request.setRole("PATIENT");
        request.setEmail("patient1@example.com");
        request.setPhone_number("1234567890");
        request.setPassword("password123");

        when(userRepo.existsByEmail("patient1@example.com")).thenReturn(false);
        when(userRepo.existsByUsername("patient1")).thenReturn(false);

        Users savedUser = new Users();
        savedUser.setUsername("patient1");
        savedUser.setRole("PATIENT");
        savedUser.setStatus("APPROVED");
        savedUser.setEmail("patient1@example.com");
        when(userRepo.save(any(Users.class))).thenReturn(savedUser);

        when(jwtService.generateToken("patient1", "PATIENT")).thenReturn("token-patient");

        AuthResponse response = userService.register(request);

        assertEquals("token-patient", response.getToken());
        assertEquals("patient1", response.getUsername());
        assertEquals("PATIENT", response.getRole());
        assertEquals("APPROVED", response.getStatus());
        assertEquals("Registration successful", response.getMessage());
    }

    @Test
    void testRegisterDoctorSuccess() throws JsonProcessingException {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("doctor1");
        request.setFirst_name("Doc");
        request.setLast_name("Tor");
        request.setDate_of_birth(new Date());
        request.setGender("Female");
        request.setRole("DOCTOR");
        request.setEmail("doctor1@example.com");
        request.setPhone_number("9876543210");
        request.setPassword("docpass");
        request.setLicense_number("LIC123");
        request.setSpeciality("Cardiology");

        when(userRepo.existsByEmail("doctor1@example.com")).thenReturn(false);
        when(userRepo.existsByUsername("doctor1")).thenReturn(false);

        Users savedUser = new Users();
        savedUser.setUsername("doctor1");
        savedUser.setRole("DOCTOR");
        savedUser.setStatus("PENDING");
        savedUser.setEmail("doctor1@example.com");
        when(userRepo.save(any(Users.class))).thenReturn(savedUser);

        when(jwtService.generateToken("doctor1", "DOCTOR")).thenReturn("token-doctor");

        AuthResponse response = userService.register(request);

        assertEquals("token-doctor", response.getToken());
        assertEquals("doctor1", response.getUsername());
        assertEquals("DOCTOR", response.getRole());
        assertEquals("PENDING", response.getStatus());
        assertEquals("Registration successful", response.getMessage());
    }

    @Test
    void testRegisterStaffSuccess() throws JsonProcessingException {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("staff1");
        request.setFirst_name("Sta");
        request.setLast_name("Ff");
        request.setDate_of_birth(new Date());
        request.setGender("Other");
        request.setRole("STAFF");
        request.setEmail("staff1@example.com");
        request.setPhone_number("5555555555");
        request.setPassword("staffpass");

        when(userRepo.existsByEmail("staff1@example.com")).thenReturn(false);
        when(userRepo.existsByUsername("staff1")).thenReturn(false);

        Users savedUser = new Users();
        savedUser.setUsername("staff1");
        savedUser.setRole("STAFF");
        savedUser.setStatus("PENDING");
        savedUser.setEmail("staff1@example.com");
        when(userRepo.save(any(Users.class))).thenReturn(savedUser);

        when(jwtService.generateToken("staff1", "STAFF")).thenReturn("token-staff");

        AuthResponse response = userService.register(request);

        assertEquals("token-staff", response.getToken());
        assertEquals("staff1", response.getUsername());
        assertEquals("STAFF", response.getRole());
        assertEquals("PENDING", response.getStatus());
        assertEquals("Registration successful", response.getMessage());
    }

    @Test
    void testRegisterEmailExists() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("user1");
        request.setEmail("exists@example.com");
        request.setRole("PATIENT");

        when(userRepo.existsByEmail("exists@example.com")).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class, () -> userService.register(request));
    }

    @Test
    void testRegisterUsernameExists() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("existsuser");
        request.setEmail("user@example.com");
        request.setRole("PATIENT");

        when(userRepo.existsByEmail("user@example.com")).thenReturn(false);
        when(userRepo.existsByUsername("existsuser")).thenReturn(true);

        assertThrows(UsernameAlreadyExistsException.class, () -> userService.register(request));
    }

    // ----------- LOGIN TESTS ------------

    @Test
    void testLoginPatientSuccess() {
        Users user = new Users();
        user.setUsername("patient1");
        user.setPassword("password123");

        Users dbUser = new Users();
        dbUser.setUsername("patient1");
        dbUser.setRole("PATIENT");
        dbUser.setStatus("APPROVED");

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(userRepo.findByUsername("patient1")).thenReturn(Optional.of(dbUser));
        when(jwtService.generateToken("patient1", "PATIENT")).thenReturn("token-patient");

        AuthResponse response = userService.verify(user);

        assertEquals("token-patient", response.getToken());
        assertEquals("patient1", response.getUsername());
        assertEquals("PATIENT", response.getRole());
        assertEquals("APPROVED", response.getStatus());
        assertEquals("Verification successful", response.getMessage());
    }

    @Test
    void testLoginDoctorSuccess() {
        Users user = new Users();
        user.setUsername("doctor1");
        user.setPassword("docpass");

        Users dbUser = new Users();
        dbUser.setUsername("doctor1");
        dbUser.setRole("DOCTOR");
        dbUser.setStatus("PENDING");

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(userRepo.findByUsername("doctor1")).thenReturn(Optional.of(dbUser));
        when(jwtService.generateToken("doctor1", "DOCTOR")).thenReturn("token-doctor");

        AuthResponse response = userService.verify(user);

        assertEquals("token-doctor", response.getToken());
        assertEquals("doctor1", response.getUsername());
        assertEquals("DOCTOR", response.getRole());
        assertEquals("PENDING", response.getStatus());
        assertEquals("Verification successful", response.getMessage());
    }

    @Test
    void testLoginStaffSuccess() {
        Users user = new Users();
        user.setUsername("staff1");
        user.setPassword("staffpass");

        Users dbUser = new Users();
        dbUser.setUsername("staff1");
        dbUser.setRole("STAFF");
        dbUser.setStatus("PENDING");

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(userRepo.findByUsername("staff1")).thenReturn(Optional.of(dbUser));
        when(jwtService.generateToken("staff1", "STAFF")).thenReturn("token-staff");

        AuthResponse response = userService.verify(user);

        assertEquals("token-staff", response.getToken());
        assertEquals("staff1", response.getUsername());
        assertEquals("STAFF", response.getRole());
        assertEquals("PENDING", response.getStatus());
        assertEquals("Verification successful", response.getMessage());
    }

    @Test
    void testLoginFailure() {
        Users user = new Users();
        user.setUsername("nouser");
        user.setPassword("wrongpass");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Bad credentials"));

        AuthResponse response = userService.verify(user);

        assertEquals("", response.getToken());
        assertEquals("", response.getUsername());
        assertEquals("", response.getRole());
        assertEquals("", response.getStatus());
        assertEquals("Verification failed", response.getMessage());
    }

    @Test
    void testLoginUserNotFound() {
        Users user = new Users();
        user.setUsername("unknownuser");
        user.setPassword("password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("User not found"));

        AuthResponse response = userService.verify(user);

        assertEquals("", response.getToken());
        assertEquals("", response.getUsername());
        assertEquals("", response.getRole());
        assertEquals("", response.getStatus());
        assertEquals("Verification failed", response.getMessage());
    }
}