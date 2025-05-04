package com.team8.healthanalytics.model;

import java.util.List;

public class InteractionDatabase {
    public static List<DrugInteraction> interactions = List.of(
            // Critical Interactions
            new DrugInteraction("Sildenafil", "Nitrates", "Critical",
                    "PDE5 inhibitor + nitrate → severe hypotension. 123+ deaths reported. Absolute contraindication [1][2][4]"),

            new DrugInteraction("Cisapride", "Erythromycin", "Critical",
                    "CYP3A4 inhibition → QT prolongation. Risk: Torsades de pointes, cardiac arrest. Alternatives: Metoclopramide [2][4]"),

            new DrugInteraction("MAOIs", "Tyramine-Rich Foods", "Critical",
                    "Hypertensive crisis (BP >180/120 mmHg). Avoid aged cheeses, cured meats [3][5]"),

            // Severe Interactions
            new DrugInteraction("Lithium", "NSAIDs", "Severe",
                    "Reduced renal clearance → lithium toxicity (≥1.5 mEq/L). Reduce dose 50%, monitor levels [2][4]"),

            new DrugInteraction("Warfarin", "Ciprofloxacin", "Severe",
                    "CYP2C9 inhibition → INR >4.5. Bleeding risk RR=3.4. Alternatives: Azithromycin [1][2]"),

            new DrugInteraction("Carbamazepine", "Fluconazole", "Severe",
                    "CYP3A4 inhibition → levels ↑40%. Risk: Ataxia, coma. Monitor levels q3d [2][4]"),

            // High-Risk Pharmacodynamic Interactions
            new DrugInteraction("SSRIs", "Triptans", "High",
                    "Serotonin syndrome: 38% mortality if untreated. Symptoms: hyperthermia, rigidity [4][5]"),

            new DrugInteraction("Quinolones", "Antiarrhythmics", "High",
                    "QTc prolongation → TdP. Risk factors: Age >65, female sex. Monitor ECG [4][5]"),

            new DrugInteraction("St. John's Wort", "Antiretrovirals", "High",
                    "CYP3A4 induction → ARV levels ↓70%. Treatment failure risk [4][5]"),

            // Moderate Interactions
            new DrugInteraction("Tetracyclines", "Dairy", "Moderate",
                    "Calcium chelation → absorption ↓50-70%. Space doses by 2-4h [3][5]"),

            new DrugInteraction("Warfarin", "Vitamin K Foods", "Moderate",
                    "INR fluctuation >20%. Maintain consistent leafy greens intake [3][5]"),

            new DrugInteraction("Oral Contraceptives", "Anticonvulsants", "Moderate",
                    "Hepatic induction → contraceptive failure (12% rate). Use IUD backup [2][4]"),

            new DrugInteraction("Grapefruit", "Statins", "Moderate",
                    "CYP3A4 inhibition → AUC ↑300%. Risk: Rhabdomyolysis [3][5]"),

            // Specific Real-World Drug Entries (optional redundancy for direct matches)
            new DrugInteraction("Fluoxetine", "Sumatriptan", "High",
                    "Serotonin syndrome risk. Use with caution and monitor symptoms."),

            new DrugInteraction("Aspirin", "Lithium", "Severe",
                    "NSAID effect: reduced renal clearance of lithium, risk of toxicity."),

            new DrugInteraction("Simvastatin", "Grapefruit", "Moderate",
                    "Increased statin levels due to CYP3A4 inhibition; risk of rhabdomyolysis.")
    );
}
