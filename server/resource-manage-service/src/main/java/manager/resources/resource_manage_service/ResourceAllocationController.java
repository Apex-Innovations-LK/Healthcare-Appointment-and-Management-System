package manager.resources.resource_manage_service;


import manager.resources.resource_manage_service.model.Resource;
import manager.resources.resource_manage_service.model.ResourceAllocation;
import manager.resources.resource_manage_service.model.SessionResourceAllocations;
import manager.resources.resource_manage_service.model.SessionResourceResourceAllocation;
import manager.resources.resource_manage_service.service.ResourceAllocationService;
import manager.resources.resource_manage_service.service.ResourceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/resource-allocation")
@CrossOrigin(origins = "http://localhost:4200")
public class ResourceAllocationController {
    private final ResourceAllocationService resourceAllocationService;
    private final ResourceService resourceService;

    ResourceAllocationController(ResourceAllocationService resourceAllocationService, ResourceService resourceService) {
        this.resourceAllocationService = resourceAllocationService;
        this.resourceService = resourceService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<SessionResourceAllocations>> getAllResourceAllocations() {
        List<ResourceAllocation> resourceAllocations= resourceAllocationService.findAllResourceAllocations();

        Map<UUID, List<ResourceAllocation>> groupBySession = resourceAllocations.stream().collect(Collectors.groupingBy(ResourceAllocation::getSessionId));

        List<SessionResourceAllocations> sessionAllocationsList = groupBySession.entrySet().stream().map( entry -> {
            UUID sessionId = entry.getKey();
            List<ResourceAllocation> allocations = entry.getValue();

            UUID allocationId = allocations.get(0).getAllocationId(); // just pick the first one
            List<Long> resourceIds = allocations.stream()
                    .map(ResourceAllocation::getResourceId)
                    .collect(Collectors.toList());

            // Earliest from and latest to
            LocalDateTime from = allocations.stream()
                    .map(ResourceAllocation::getFrom)
                    .min(LocalDateTime::compareTo)
                    .orElse(null);

            LocalDateTime to = allocations.stream()
                    .map(ResourceAllocation::getTo)
                    .max(LocalDateTime::compareTo)
                    .orElse(null);

            return new SessionResourceAllocations(allocationId, sessionId, resourceIds, from, to);
        }).collect(Collectors.toList());

        return new ResponseEntity<>(sessionAllocationsList , HttpStatus.OK);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<SessionResourceResourceAllocation> getResourceAllocationById(@PathVariable("id") UUID id) {
        List<ResourceAllocation> resourceAllocations = resourceAllocationService.findAllResourceAllocationBySessionId(id);
        List<Long> resourceTds = resourceAllocations.stream()
                .map(ResourceAllocation::getResourceId)
                .distinct()
                .collect(Collectors.toList());

        List<Resource> resources = resourceService.findAllByResourceIdIn(resourceTds);

        SessionResourceResourceAllocation sessionResourceResourceAllocations = new SessionResourceResourceAllocation();
        sessionResourceResourceAllocations.setResourceAllocation(resourceAllocations.get(0));
        sessionResourceResourceAllocations.setResources(resources);

        return new ResponseEntity<>(sessionResourceResourceAllocations, HttpStatus.OK);
    }

}
