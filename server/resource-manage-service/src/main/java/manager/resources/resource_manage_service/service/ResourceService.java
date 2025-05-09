package manager.resources.resource_manage_service.service;

import manager.resources.resource_manage_service.exceotion.ResourceAllocationNotFoundException;
import manager.resources.resource_manage_service.model.Resource;
import manager.resources.resource_manage_service.repo.ResourceRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepo resourceRepo;

    @Autowired
    public ResourceService(ResourceRepo resourceRepo) {
        this.resourceRepo = resourceRepo;
    }

    public Resource addResource(Resource resource) {
        return resourceRepo.save(resource);
    }

    public List<Resource> findAllResources() {
        return resourceRepo.findAll();
    }

    public List<Resource> findAllByResourceIdIn(List<Long> resourceIds) {
        return resourceRepo.findAllByResourceIdIn(resourceIds).orElseThrow(() -> new ResourceAllocationNotFoundException("Resource Allocation by ids was not found"));
    }



    public Integer getResourceCount() {
        return (int) resourceRepo.count();
    }

    public Resource getResourceByResourceId(Long resourceId) {
        return resourceRepo.getResourceByResourceId(resourceId).orElseThrow(() -> new ResourceAllocationNotFoundException("Not Found 404"));
    }
}
