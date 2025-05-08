package manager.resources.resource_manage_service.service;

import manager.resources.resource_manage_service.exceotion.ResourceAllocationNotFoundException;
import manager.resources.resource_manage_service.model.ResourceAllocation;
import manager.resources.resource_manage_service.repo.ResourceAllocationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public List<ResourceAllocation> findAllResourceAllocationBySessionId(UUID id) {
        return resourceAllocationRepo.findAllResourceAllocationBySessionId(id).orElseThrow(() -> new ResourceAllocationNotFoundException("Resource Allocation by id " + id + " was not found"));
    }
}
