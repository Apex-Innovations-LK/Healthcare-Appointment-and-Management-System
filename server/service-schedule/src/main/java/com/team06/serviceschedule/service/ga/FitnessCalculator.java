package com.team06.serviceschedule.service.ga;

import com.team06.serviceschedule.model.Availibility;
import lombok.AllArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@AllArgsConstructor
public class FitnessCalculator {

    private List<Availibility> sessions;

    public double calculateFitness(Chromosome chromosome) {
        double score = 0.0;
        Map<UUID, List<Availibility>> staffAssignments = new HashMap<>();

        for (Gene gene : chromosome.getGenes()) {
            Availibility session = sessions.stream()
                    .filter(s -> s.getSession_id().equals(gene.getSession_id()))
                    .findFirst()
                    .orElse(null);

            if (session == null) continue;

            staffAssignments.putIfAbsent(gene.getStaff_id(), new java.util.ArrayList<>());

            boolean overlap = staffAssignments.get(gene.getStaff_id()).stream()
                    .anyMatch(existingSession -> existingSession.getFrom().equals(session.getFrom()));

            if (overlap) {
                score -= 50; // Penalty for overlap
            } else {
                staffAssignments.get(gene.getStaff_id()).add(session);
                score += 10; // Reward
            }
        }
        return score;
    }
}
