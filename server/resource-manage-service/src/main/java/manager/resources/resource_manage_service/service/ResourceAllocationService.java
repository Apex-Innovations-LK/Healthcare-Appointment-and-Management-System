package manager.resources.resource_manage_service.service;

import manager.resources.resource_manage_service.exceotion.ResourceAllocationNotFoundException;
import manager.resources.resource_manage_service.model.ResourceAllocation;
import manager.resources.resource_manage_service.repo.ResourceAllocationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ResourceAllocationService {

    private final ResourceAllocationRepo resourceAllocationRepo;

    @Autowired
    public ResourceAllocationService(ResourceAllocationRepo resourceAllocationRepo) {
        this.resourceAllocationRepo = resourceAllocationRepo;
    }

    public List<ResourceAllocation> findAllResourceAllocations() {
        return resourceAllocationRepo.findAll();
    }

//    public ResourceAllocation findResourceAllocationBySessionId(UUID id) {
//        return resourceAllocationRepo.findResourceAllocationBySessionId(id).orElseThrow(() -> new ResourceAllocationNotFoundException("Resource Allocation by id " + id + " was not found"));
//    }

    public ResourceAllocation addResourceAllocation(ResourceAllocation resourceAllocation) {
        return resourceAllocationRepo.save(resourceAllocation);
    }

    public List<ResourceAllocation> findAllResourceAllocationBySessionId(UUID id) {
        return resourceAllocationRepo.findAllResourceAllocationBySessionId(id).orElseThrow(() -> new ResourceAllocationNotFoundException("Resource Allocation by id " + id + " was not found"));
    }

    public List<ResourceAllocation> getUpcomingResourceAllocations(Long resourceId) {
        LocalDateTime today = LocalDateTime.now();
        return resourceAllocationRepo.findByResourceIdAndFromAfter(resourceId,today);
    }

    public List<Long> getBusyResources(OffsetDateTime givenFrom, OffsetDateTime  givenTo) {
        return resourceAllocationRepo.findBusyResourceIds(givenFrom.toLocalDateTime(), givenTo.toLocalDateTime());
    }

    @Transactional
    public void deleteResourceAllocation(UUID sessionId , Long resourceId) {
        resourceAllocationRepo.deleteBySessionIdAndResourceId(sessionId , resourceId);
    }
}
