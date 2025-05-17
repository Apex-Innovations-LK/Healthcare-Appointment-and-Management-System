package manager.resources.resource_manage_service.repo;

import manager.resources.resource_manage_service.model.ResourceAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.Optional;


public interface ResourceAllocationRepo extends JpaRepository<ResourceAllocation , UUID> {

    Optional<List<ResourceAllocation>> findAllResourceAllocationBySessionId(UUID id);

    List<ResourceAllocation> findByResourceIdAndFromAfter(Long resourceId, LocalDateTime from);

    @Query("SELECT DISTINCT r.resourceId FROM ResourceAllocation r " +
            "WHERE r.from < :givenTo AND r.to > :givenFrom")
    List<Long> findBusyResourceIds(@Param("givenFrom") LocalDateTime from, @Param("givenTo") LocalDateTime to);

    void deleteResourceAllocationByAllocationId(UUID id);

    @Modifying
    @Transactional
    @Query("DELETE FROM ResourceAllocation ra WHERE ra.sessionId = :sessionId AND ra.resourceId = :resourceId")
    void deleteBySessionIdAndResourceId(UUID sessionId, Long resourceId);
}
