package manager.resources.resource_manage_service.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class SessionResourceAllocations implements Serializable {
    private UUID allocation_id;
    private UUID sessionId;
    private List<Long> resourceIds;
    private LocalDateTime from;
    private LocalDateTime to;

    public SessionResourceAllocations() {

    }

    public SessionResourceAllocations(UUID allocation_id, UUID sessionId, List<Long> resourceIds, LocalDateTime from, LocalDateTime to) {
        this.allocation_id = allocation_id;
        this.sessionId = sessionId;
        this.resourceIds = resourceIds;
        this.from = from;
        this.to = to;
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
    public List<Long> getResourceIds() {
        return resourceIds;
    }
    public void setResourceIds(List<Long> resourceIds) {
        this.resourceIds = resourceIds;
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
