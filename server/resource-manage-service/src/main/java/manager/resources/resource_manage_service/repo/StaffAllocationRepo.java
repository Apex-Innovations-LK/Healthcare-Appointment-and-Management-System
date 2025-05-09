package manager.resources.resource_manage_service.repo;

import manager.resources.resource_manage_service.model.StaffAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.objenesis.instantiator.util.UnsafeUtils;

import java.util.UUID;

public interface StaffAllocationRepo extends JpaRepository<StaffAllocation, UUID> {

    StaffAllocation getStaffAllocationByStaffAllocationId(UUID id);
}
