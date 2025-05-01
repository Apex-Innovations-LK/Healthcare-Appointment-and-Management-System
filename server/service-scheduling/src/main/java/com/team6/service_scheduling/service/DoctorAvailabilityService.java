package main.java.com.team6.service_scheduling.service;

import com.yourorg.scheduling.model.Session;
import com.yourorg.scheduling.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class DoctorAvailabilityService {

    @Autowired
    private SessionRepository sessionRepository;

    public boolean isDoctorAvailable(UUID doctorId, LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);

        List<Session> sessions = sessionRepository.findByDoctorIdAndFromBetween(
            doctorId,
            Timestamp.valueOf(start),
            Timestamp.valueOf(end)
        );

        return !sessions.isEmpty();
    }
}