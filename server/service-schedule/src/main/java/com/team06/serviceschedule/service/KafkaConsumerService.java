//package com.team06.serviceschedule.service;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.team06.serviceschedule.dto.DoctorKafkaEvent;
//import com.team06.serviceschedule.dto.UserKafkaEvent;
//import com.team06.serviceschedule.model.Availibility;
//import com.team06.serviceschedule.model.Users;
//import com.team06.serviceschedule.repo.AvailibilityRepo;
//import com.team06.serviceschedule.repo.UserRepo;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.kafka.annotation.KafkaListener;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
////
//@Service
//public class KafkaConsumerService {
//
//    private final ObjectMapper objectMapper;
//
//    @Autowired
//    private UserRepo userRepo;
//
//    @Autowired
//    private AvailibilityRepo availabilityRepo;
//
//    public KafkaConsumerService(ObjectMapper objectMapper) {
//        this.objectMapper = objectMapper;
//    }
//
//    @KafkaListener(topics = "user_created", groupId = "group_id")
//    public void consumeUserEvent(String message) {
//        try {
//            System.out.println(message);
//            String actualJson = objectMapper.readValue(message, String.class);
//            UserKafkaEvent event = objectMapper.readValue(actualJson, UserKafkaEvent.class);
//
//            if (event.getRole().equals("DOCTOR") || event.getRole().equals("STAFF")) {
//                Users user = new Users();
//                user.setEmail(event.getEmail());
//                user.setId(event.getUserId());
//                user.setRole(event.getRole());
//                user.setUsername(event.getUsername());
//
//                userRepo.save(user);
//                List<Users> users = userRepo.findAllByRole("STAFF");
//                System.out.println("users" + users);
//            }
//
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//
//    @KafkaListener(topics = "availability_settled", groupId = "group_id")
//    public void consumeDoctorEvent(String message) {
//        try{
//            System.out.println(message);
//            String actualJson = objectMapper.readValue(message, String.class);
//            DoctorKafkaEvent event = objectMapper.readValue(actualJson, DoctorKafkaEvent.class);
//
//            Availibility availibility = new Availibility();
//            availibility.setSession_id(event.getSession_id());
//            availibility.setDoctor_id(event.getDoctor_id());
//            availibility.setFrom(event.getFrom());
//            availibility.setTo(event.getTo());
//            availibility.setNumber_of_patients(event.getNumber_of_patients());
//
//            System.out.println("availability" + availibility);
//            System.out.println("message" + message);
//
//            availabilityRepo.save(availibility);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//}

package com.team06.serviceschedule.service;

import com.team06.serviceschedule.dto.DoctorKafkaEvent;
import com.team06.serviceschedule.dto.UserKafkaEvent;
import com.team06.serviceschedule.model.Availibility;
import com.team06.serviceschedule.model.Users;
import com.team06.serviceschedule.repo.AvailibilityRepo;
import com.team06.serviceschedule.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KafkaConsumerService {

    private final UserRepo userRepo;
    private final AvailibilityRepo availibilityRepo;

    @Autowired
    public KafkaConsumerService(UserRepo userRepo, AvailibilityRepo availibilityRepo) {
        this.userRepo = userRepo;
        this.availibilityRepo = availibilityRepo;
    }

    @KafkaListener(
            topics = "user_created",
            groupId = "group_id",
            containerFactory = "userKafkaEventListenerFactory"
    )
    public void consumeUserEvent(UserKafkaEvent event) {
        System.out.println("Received User Event: " + event);

        if ("DOCTOR".equalsIgnoreCase(event.getRole()) || "STAFF".equalsIgnoreCase(event.getRole())) {
            Users user = new Users();
            user.setId(event.getUserId());
            user.setUsername(event.getUsername());
            user.setEmail(event.getEmail());
            user.setRole(event.getRole());

            userRepo.save(user);

            List<Users> staffUsers = userRepo.findAllByRole("STAFF");
            System.out.println("Staff users: " + staffUsers);
        }
    }

    @KafkaListener(
            topics = "availability_settled",
            groupId = "group_id",
            containerFactory = "doctorKafkaEventListenerFactory"
    )
    public void consumeDoctorEvent(DoctorKafkaEvent event) {
        System.out.println("Received Doctor Event: " + event);

        Availibility availability = new Availibility();
        availability.setSession_id(event.getSession_id());
        availability.setDoctor_id(event.getDoctor_id());
        availability.setFrom(event.getFrom());
        availability.setTo(event.getTo());
        availability.setNumber_of_patients(event.getNumber_of_patients());

        availibilityRepo.save(availability);
        System.out.println("Saved availability: " + availability);
    }
}
