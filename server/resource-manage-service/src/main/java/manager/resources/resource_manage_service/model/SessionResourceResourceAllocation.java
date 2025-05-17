package manager.resources.resource_manage_service.model;

import java.io.Serializable;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class SessionResourceResourceAllocation implements Serializable {
    private UUID allocation_id;
    private UUID sessionId;
    private List<Resource> resources;
    private LocalDateTime from;
    private LocalDateTime to;
    private float duration;

    public SessionResourceResourceAllocation() {

    }

    public SessionResourceResourceAllocation(UUID allocation_id, UUID sessionId, List<Resource> resources, LocalDateTime from, LocalDateTime to ,float duration) {
        this.allocation_id = allocation_id;
        this.sessionId = sessionId;
        this.resources = resources;
        this.from = from;
        this.to = to;
        this.duration = duration;
    }

    public UUID getAllocation_id() {
        return allocation_id;
    }
    public void setAllocation_id(UUID allocation_id) {
        this.allocation_id = allocation_id;
    }

    public UUID getSessionId() {
        return sessionId;
    }
    public void setSessionId(UUID sessionId) {
        this.sessionId = sessionId;
    }
    public List<Resource> getResources() {
        return resources;
    }
    public void setResources(List<Resource> resources) {
        this.resources = resources;
    }
    public LocalDateTime getFrom() {
        return from;
    }
    public void setFrom(LocalDateTime from) {
        this.from = from;
    }
    public LocalDateTime getTo() {
        return to;
    }
    public void setTo(LocalDateTime to) {
        this.to = to;
    }
    public float getDuration() {
        return duration;
    }
    public void setDuration(float duration) {
        this.duration = duration;
    }

    public void setResourceAllocation(ResourceAllocation resourceAllocation) {
        this.allocation_id = resourceAllocation.getAllocationId();
        this.sessionId = resourceAllocation.getSessionId();
        this.from = resourceAllocation.getFrom();
        this.to = resourceAllocation.getTo();

        this.duration = Duration.between(resourceAllocation.getFrom(), resourceAllocation.getTo()).toHours();

    }
}
