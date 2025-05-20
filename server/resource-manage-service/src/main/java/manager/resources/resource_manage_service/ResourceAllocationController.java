package manager.resources.resource_manage_service;


import manager.resources.resource_manage_service.model.Resource;
import manager.resources.resource_manage_service.model.ResourceAllocation;
import manager.resources.resource_manage_service.model.SessionResourceAllocations;
import manager.resources.resource_manage_service.model.SessionResourceResourceAllocation;
import manager.resources.resource_manage_service.service.ResourceAllocationService;
import manager.resources.resource_manage_service.service.ResourceService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/resource/resource-allocation")
@CrossOrigin(origins = "http://35.184.60.72:4200")
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

    @GetMapping("/upcoming/{id}")
    public ResponseEntity<List<ResourceAllocation>> getUpcomingAllocationsByResourceId(@PathVariable("id") Long id) {
        List<ResourceAllocation> resourceAllocations = resourceAllocationService.getUpcomingResourceAllocations(id);
        return new ResponseEntity<>(resourceAllocations, HttpStatus.OK);
    }

    @GetMapping("/busy/{from}/{to}")
    public List<Long> getBusyResources(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime from,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime to) {
        return resourceAllocationService.getBusyResources(from, to);
    }

    @GetMapping("/available/{from}/{to}")
    public Map<String,List<Resource>> getAvailableResources(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime from,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime to) {
        List<Long> busyResourceIds = resourceAllocationService.getBusyResources(from,to);
        List<Resource> allResources = resourceService.findAllResources();
        List<Resource> availableResources = allResources.stream()
                .filter(resource -> !busyResourceIds.contains(resource.getResourceId()))  // Exclude busy resources
                .filter(resource -> "Room".equalsIgnoreCase(resource.getType()) || "Equipment".equalsIgnoreCase(resource.getType()))  // Include only "Room" or "Equipment" types
                .collect(Collectors.toList());

        Map<String, List<Resource>> availableResourcesMap = availableResources.stream()
                .collect(Collectors.groupingBy(resource -> {
                    if ("Room".equalsIgnoreCase(resource.getType())) {
                        return "room"; // Map "Room" to "room"
                    } else if ("Equipment".equalsIgnoreCase(resource.getType())) {
                        return "equipment"; // Map "Equipment" to "equipment"
                    } else {
                        return null; // Just in case you have other types
                    }
                }));


        return availableResourcesMap;
    }

    @PostMapping("/add")
    public ResponseEntity<ResourceAllocation> addResourceAllocation(@RequestBody ResourceAllocation resourceAllocation) {
        ResourceAllocation newResourceAllocation = resourceAllocationService.addResourceAllocation(resourceAllocation);
        return new ResponseEntity<>(newResourceAllocation, HttpStatus.CREATED);
    }


    @DeleteMapping("/delete/{sessionId}/{resourceId}")
    public ResponseEntity<?> deleteResourceAllocation(@PathVariable("sessionId") UUID sessionId , @PathVariable("resourceId") Long resourceId) {
        resourceAllocationService.deleteResourceAllocation( sessionId , resourceId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
