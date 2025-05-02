package com.team06.serviceschedule.service;

import com.team06.serviceschedule.model.Availibility;
import com.team06.serviceschedule.model.SessionAssignment;
import com.team06.serviceschedule.model.Users;
import com.team06.serviceschedule.repo.AvailibilityRepo;
import com.team06.serviceschedule.repo.SessionAssignmentRepo;
import com.team06.serviceschedule.repo.UserRepo;
import com.team06.serviceschedule.service.ga.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SchedularService {

    private final AvailibilityRepo availibilityRepo;
    private final UserRepo userRepo;
    private final SessionAssignmentRepo sessionAssignmentRepo;

    public String runScheduler() {
        List<Availibility> sessions = availibilityRepo.findAll();
        List<UUID> staffIds = userRepo.findAll()
                .stream()
                .filter(user -> "STAFF".equals(user.getRole()))
                .map(Users::getId)
                .collect(Collectors.toList());

        if (sessions.isEmpty() || staffIds.isEmpty()) {
            return "No sessions or staff available!";
        }

        GeneticAlgorithmRunner gaRunner = new GeneticAlgorithmRunner(sessions, staffIds);
        Chromosome bestChromosome = gaRunner.run();

        // Save assignment
        for (Gene gene : bestChromosome.getGenes()) {
            Availibility session = sessions.stream()
                    .filter(s -> s.getSession_id().equals(gene.getSession_id()))
                    .findFirst()
                    .orElseThrow();

            SessionAssignment assignment = SessionAssignment.builder()
                    .session_id(session.getSession_id())
                    .doctor_id(session.getDoctor_id())
                    .staff_id(gene.getStaff_id())
                    .from(session.getFrom())
                    .to(session.getTo())
                    .number_of_patients(session.getNumber_of_patients())
                    .build();

            sessionAssignmentRepo.save(assignment);
        }

        return "Scheduler completed successfully!";
    }
}
