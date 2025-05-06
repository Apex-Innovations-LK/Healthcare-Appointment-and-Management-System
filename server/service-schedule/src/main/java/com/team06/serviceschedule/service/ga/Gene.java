package com.team06.serviceschedule.service.ga;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Gene {
    private UUID session_id;
    private UUID staff_id;
}
