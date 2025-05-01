package main.java.com.team6.service_scheduling.repository;

@Repository
public interface SessionRepository extends JpaRepository<Session, UUID> {

    @Query("SELECT s FROM Session s WHERE s.doctorId = :doctorId AND s.from >= :start AND s.to <= :end")
    List<Session> findByDoctorIdAndDateRange(
        @Param("doctorId") UUID doctorId,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );
}
