package com.springboot.healthcare.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.springboot.healthcare.dto.AuthResponse;
import com.springboot.healthcare.dto.RegisterRequest;
import com.springboot.healthcare.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

   @InjectMocks
   private UserController userController;

   @Mock
   private UserService userService;

   @Test
   void testRegisterSuccess() throws JsonProcessingException {
       RegisterRequest request = new RegisterRequest();
       request.setUsername("johndoe");
       request.setFirst_name("John");
       request.setLast_name("Doe");
       request.setDate_of_birth(new Date());
       request.setGender("Male");
       request.setRole("PATIENT");
       request.setEmail("john@example.com");
       request.setPhone_number("9876543210");
       request.setPassword("password123");

       AuthResponse expectedResponse = new AuthResponse(
               "token123", "johndoe", "PATIENT", "APPROVED", "Registration successful"
       );

       when(userService.register(any(RegisterRequest.class))).thenReturn(expectedResponse);

       AuthResponse actualResponse = userController.register(request);
       System.out.println("Success: " + actualResponse);
       assertEquals(expectedResponse, actualResponse);
   }

   @Test
   void testRegisterDoctorSuccess() throws JsonProcessingException {
       RegisterRequest request = new RegisterRequest();
       request.setUsername("docuser");
       request.setFirst_name("Doc");
       request.setLast_name("Tor");
       request.setDate_of_birth(new Date());
       request.setGender("Female");
       request.setRole("DOCTOR");
       request.setEmail("doc@example.com");
       request.setPhone_number("1234567890");
       request.setPassword("docpass");
       request.setLicense_number("LIC123456");
       request.setSpeciality("Cardiology");

       AuthResponse expectedResponse = new AuthResponse(
               "token456", "docuser", "DOCTOR", "PENDING", "Registration successful"
       );

       when(userService.register(any(RegisterRequest.class))).thenReturn(expectedResponse);

       AuthResponse actualResponse = userController.register(request);
       System.out.println("Doctor Success: " + actualResponse);
       assertEquals(expectedResponse, actualResponse);
   }

   @Test
   void testRegisterEmailExists() throws JsonProcessingException {
       RegisterRequest request = new RegisterRequest();
       request.setEmail("existing@example.com");

       when(userService.register(any(RegisterRequest.class)))
               .thenThrow(new RuntimeException("Email already exists"));

       RuntimeException exception = assertThrows(RuntimeException.class, () -> {
           userController.register(request);
       });

       System.out.println("Email Exists Exception: " + exception.getMessage());
       assertEquals("Email already exists", exception.getMessage());
   }

   @Test
   void testRegisterUsernameExists() throws JsonProcessingException {
       RegisterRequest request = new RegisterRequest();
       request.setUsername("existinguser");

       when(userService.register(any(RegisterRequest.class)))
               .thenThrow(new RuntimeException("Username already exists"));

       RuntimeException exception = assertThrows(RuntimeException.class, () -> {
           userController.register(request);
       });

       System.out.println("Username Exists Exception: " + exception.getMessage());
       assertEquals("Username already exists", exception.getMessage());
   }

   @Test
   void testRegisterNullRequest() {
       NullPointerException exception = assertThrows(NullPointerException.class, () -> {
           userController.register(null);
       });

       System.out.println("Null Request Exception: " + exception.getClass().getSimpleName());
   }

   @Test
   void testRegisterMissingFields() throws JsonProcessingException {
       RegisterRequest request = new RegisterRequest(); // all fields null

       when(userService.register(any(RegisterRequest.class)))
               .thenThrow(new RuntimeException("Missing required fields"));

       Exception exception = assertThrows(RuntimeException.class, () -> {
           userController.register(request);
       });

       System.out.println("Missing Fields Exception: " + exception.getMessage());
       assertEquals("Missing required fields", exception.getMessage());
   }

   @Test
   void testRegisterServiceFailure() throws JsonProcessingException {
       RegisterRequest request = new RegisterRequest();
       request.setUsername("erroruser");

       when(userService.register(any(RegisterRequest.class)))
               .thenThrow(new RuntimeException("Unexpected service error"));

       Exception exception = assertThrows(RuntimeException.class, () -> {
           userController.register(request);
       });

       System.out.println("Service Failure Exception: " + exception.getMessage());
       assertEquals("Unexpected service error", exception.getMessage());
   }
}
