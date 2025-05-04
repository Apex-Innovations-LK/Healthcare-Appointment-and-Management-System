package com.team8.healthanalytics.service;

import com.team8.healthanalytics.model.DrugInteraction;
import com.team8.healthanalytics.model.InteractionDatabase;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class InteractionChecker {

    private static final Map<String, String> drugToClassMap = Map.ofEntries(
            Map.entry("aspirin", "NSAIDs"),
            Map.entry("ibuprofen", "NSAIDs"),
            Map.entry("naproxen", "NSAIDs"),
            Map.entry("fluoxetine", "SSRIs"),
            Map.entry("sertraline", "SSRIs"),
            Map.entry("sumatriptan", "Triptans"),
            Map.entry("warfarin", "Warfarin"),  // Warfarin already specific
            Map.entry("ciprofloxacin", "Ciprofloxacin"), // already specific
            Map.entry("grapefruit", "Grapefruit"),
            Map.entry("simvastatin", "Statins"),
            Map.entry("st. john's wort", "St. John's Wort"),
            Map.entry("ritonavir", "Antiretrovirals")
            // ➕ Add more mappings as needed
    );

    private String normalize(String drug) {
        return drugToClassMap.getOrDefault(drug.toLowerCase(), drug);
    }

    public List<DrugInteraction> checkInteractions(List<String> medications) {
        Set<String> seenPairs = new HashSet<>();
        List<DrugInteraction> results = new ArrayList<>();

        for (int i = 0; i < medications.size(); i++) {
            for (int j = i + 1; j < medications.size(); j++) {
                String med1 = normalize(medications.get(i));
                String med2 = normalize(medications.get(j));

                // Normalize pair to avoid duplicates (e.g., alphabetical order)
                String pair = med1.compareTo(med2) < 0 ?
                        med1 + "|" + med2 : med2 + "|" + med1;

                if (!seenPairs.add(pair)) continue;

                InteractionDatabase.interactions.stream()
                        .filter(interaction ->
                                (interaction.getDrugA().equalsIgnoreCase(med1) &&
                                        interaction.getDrugB().equalsIgnoreCase(med2)) ||
                                        (interaction.getDrugA().equalsIgnoreCase(med2) &&
                                                interaction.getDrugB().equalsIgnoreCase(med1)))
                        .forEach(results::add);
            }
        }
        return results;
    }
}
