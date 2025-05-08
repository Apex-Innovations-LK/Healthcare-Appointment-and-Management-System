package manager.resources.resource_manage_service.repo;

import manager.resources.resource_manage_service.model.ResourceAllocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;
import java.util.Optional;


public interface ResourceAllocationRepo extends JpaRepository<ResourceAllocation , UUID> {

    Optional<List<ResourceAllocation>> findAllResourceAllocationBySessionId(UUID id);

//    <T> ScopedValue<T> findAllResourceAllocationBySessionId(UUID id);
}
