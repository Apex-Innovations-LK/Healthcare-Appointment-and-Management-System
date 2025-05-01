package main.java.com.team6.service_scheduling.service;

@Service
public class ScheduleService {

    @Autowired
    private SessionRepository sessionRepository;

    public boolean isDoctorAvailableOnDate(UUID doctorId, LocalDate date) {
        List<Session> sessions = sessionRepository
                .findByDoctorIdAndDateRange(doctorId, date.atStartOfDay(), date.atTime(LocalTime.MAX));
        return !sessions.isEmpty();
    }
}
