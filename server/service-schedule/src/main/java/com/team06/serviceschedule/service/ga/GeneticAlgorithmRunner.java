package com.team06.serviceschedule.service.ga;

import com.team06.serviceschedule.model.Availibility;
import lombok.AllArgsConstructor;

import java.util.*;

@AllArgsConstructor
public class GeneticAlgorithmRunner {

    private List<Availibility> sessions;
    private List<UUID> staffIds;

    public Chromosome run() {
        List<Chromosome> population = initializePopulation(100);
        FitnessCalculator fitnessCalculator = new FitnessCalculator(sessions);

        for (int generation = 0; generation < 300; generation++) {
            population.forEach(chromosome -> chromosome.setFitness(fitnessCalculator.calculateFitness(chromosome)));
            population.sort(Comparator.comparingDouble(Chromosome::getFitness).reversed());

            List<Chromosome> nextGen = new ArrayList<>(population.subList(0, 20)); // Elitism: top 20 survive

            Random random = new Random();

            while (nextGen.size() < 100) {
                Chromosome parent1 = tournamentSelection(population);
                Chromosome parent2 = tournamentSelection(population);

                Chromosome child = crossover(parent1, parent2);
                mutate(child);
                nextGen.add(child);
            }

            population = nextGen;
        }

        return population.get(0);
    }

    private List<Chromosome> initializePopulation(int size) {
        List<Chromosome> population = new ArrayList<>();
        Random random = new Random();

        for (int i = 0; i < size; i++) {
            List<Gene> genes = new ArrayList<>();
            for (Availibility session : sessions) {
                UUID staff_id = staffIds.get(random.nextInt(staffIds.size()));
                genes.add(new Gene(session.getSession_id(), staff_id));
            }
            population.add(new Chromosome(genes, 0.0));
        }

        return population;
    }

    private Chromosome tournamentSelection(List<Chromosome> population) {
        Random random = new Random();
        List<Chromosome> tournament = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            tournament.add(population.get(random.nextInt(population.size())));
        }
        tournament.sort(Comparator.comparingDouble(Chromosome::getFitness).reversed());
        return tournament.get(0);
    }

    private Chromosome crossover(Chromosome parent1, Chromosome parent2) {
        List<Gene> childGenes = new ArrayList<>();
        Random random = new Random();

        for (int i = 0; i < parent1.getGenes().size(); i++) {
            Gene gene = random.nextBoolean() ? parent1.getGenes().get(i) : parent2.getGenes().get(i);
            childGenes.add(new Gene(gene.getSession_id(), gene.getStaff_id()));
        }
        return new Chromosome(childGenes, 0.0);
    }

    private void mutate(Chromosome chromosome) {
        Random random = new Random();
        int index = random.nextInt(chromosome.getGenes().size());
        chromosome.getGenes().get(index).setStaff_id(staffIds.get(random.nextInt(staffIds.size())));
    }
}
