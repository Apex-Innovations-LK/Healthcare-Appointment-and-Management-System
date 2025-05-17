package manager.resources.resource_manage_service.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import manager.resources.resource_manage_service.model.Resource;

import java.util.List;
import java.util.Optional;

public interface ResourceRepo extends JpaRepository< Resource , Long>{

    Optional<List<Resource>> findAllByResourceIdIn(List<Long> resourceTds);

    Optional<Resource> getResourceByResourceId(Long resourceId);
}
