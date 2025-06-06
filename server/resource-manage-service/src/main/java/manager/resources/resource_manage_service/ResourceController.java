package manager.resources.resource_manage_service;

import manager.resources.resource_manage_service.model.Resource;
import manager.resources.resource_manage_service.service.ResourceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/resource")
@CrossOrigin(origins = "http://localhost:4200")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Resource>> getAllResources() {
        List<Resource> resources = resourceService.findAllResources();
        return new ResponseEntity<>(resources, HttpStatus.OK);
    }



    @PostMapping("/add")
    public ResponseEntity<Resource> addResource(@RequestBody Resource resource) {
        Resource savedResource = resourceService.addResource(resource);
        return new ResponseEntity<>(savedResource , HttpStatus.CREATED);
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> getResourceCount() {
        Integer resourceCount = resourceService.getResourceCount();
        return new ResponseEntity<>(resourceCount, HttpStatus.OK);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<Resource> findResourceById(@PathVariable("id") Long id) {
        Resource resource = resourceService.getResourceByResourceId(id);
        return new ResponseEntity<>(resource , HttpStatus.OK);
    }

}
