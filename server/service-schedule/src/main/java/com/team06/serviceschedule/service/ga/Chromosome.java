package com.team06.serviceschedule.service.ga;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Chromosome {
    private List<Gene> genes;
    private double fitness;
}
