package com.team06.serviceschedule.service;

import com.team06.serviceschedule.model.Availibility;
import com.team06.serviceschedule.model.SessionAssignment;
import com.team06.serviceschedule.model.Users;
import com.team06.serviceschedule.repo.AvailibilityRepo;
import com.team06.serviceschedule.repo.SessionAssignmentRepo;
import com.team06.serviceschedule.repo.UserRepo;
import com.team06.serviceschedule.service.ga.*;
import lombok.RequiredArgsConstructor;
import netscape.javascript.JSObject;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SchedularService {

    private final AvailibilityRepo availibilityRepo;
    private final UserRepo userRepo;
    private final SessionAssignmentRepo sessionAssignmentRepo;

    public ResponseEntity<Map<String, String>> runScheduler() {
        List<Availibility> sessions = availibilityRepo.findAll();
        System.out.println(sessions);
        List<UUID> staffIds = userRepo.findAll()
                .stream()
                .filter(user -> "STAFF".equals(user.getRole()))
                .map(Users::getId)
                .collect(Collectors.toList());

        if (sessions.isEmpty() || staffIds.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("message", "No sessions or staff available!"));

        }

        GeneticAlgorithmRunner gaRunner = new GeneticAlgorithmRunner(sessions, staffIds);
        Chromosome bestChromosome = gaRunner.run();

        // Save assignment
        for (Gene gene : bestChromosome.getGenes()) {
            Availibility session = sessions.stream()
                    .filter(s -> s.getSession_id().equals(gene.getSession_id()))
                    .findFirst()
                    .orElseThrow();

            SessionAssignment assignment = new SessionAssignment();
                    assignment.setSession_id(session.getSession_id());
                    assignment.setDoctor_id(session.getDoctor_id());
                    assignment.setStaff_id(gene.getStaff_id());
                    assignment.setFrom(session.getFrom());
                    assignment.setTo(session.getTo());
                    assignment.setNumber_of_patients(session.getNumber_of_patients());


            sessionAssignmentRepo.save(assignment);
        }
        System.out.println("success");
        return ResponseEntity.ok(Collections.singletonMap("message", "Scheduler completed successfully!"));

    }


    public Map<String, Long> getCount() {
        long doctorCount = availibilityRepo.countDistinctDoctorsWithAvailability();
        long staffCount = userRepo.countStaffMembers();

        Map<String, Long> stats = new HashMap<>();
        stats.put("doctorCount", doctorCount);
        stats.put("staffCount", staffCount);
        return stats;
    }
}
