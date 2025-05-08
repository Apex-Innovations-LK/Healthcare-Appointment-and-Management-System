package manager.resources.resource_manage_service.model;


import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "resource_allocations" , schema = "resource_manager")
public class ResourceAllocation implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false , updatable = false)
    private UUID allocationId;

    private UUID sessionId;
    private Long resourceId;
    private LocalDateTime from;
    private LocalDateTime to;

    public ResourceAllocation() {

    }

    public ResourceAllocation(UUID sessionId, Long resourceId, LocalDateTime from, LocalDateTime to) {
        this.sessionId = sessionId;
        this.resourceId = resourceId;
        this.from = from;
        this.to = to;
    }

    public UUID getAllocationId() {
        return allocationId;
    }

    public void setAllocationId(UUID allocationId) {
        this.allocationId = allocationId;
    }

    public UUID getSessionId() {
        return sessionId;
    }

    public void setSessionId(UUID sessionId) {
        this.sessionId = sessionId;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
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

}
