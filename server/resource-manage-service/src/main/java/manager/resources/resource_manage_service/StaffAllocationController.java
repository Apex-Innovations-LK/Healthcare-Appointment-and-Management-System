package manager.resources.resource_manage_service;

import manager.resources.resource_manage_service.model.StaffAllocation;
import manager.resources.resource_manage_service.model.StaffUtilizationOverallDto;
import manager.resources.resource_manage_service.service.StaffAllocationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/resource/staff-utilization")
@CrossOrigin(origins = "http://localhost:4200")
public class StaffAllocationController {
    private final StaffAllocationService staffAllocationService;

    public StaffAllocationController(StaffAllocationService staffAllocationService) {
        this.staffAllocationService = staffAllocationService;
    }
    @GetMapping("/overall")
    public StaffUtilizationOverallDto getStaffUtilizationOverall() {
        return staffAllocationService.getStaffUtilizationOverall();
    }

    @GetMapping("/all")
    public ResponseEntity<List<StaffAllocation>> getAllStaffAllocations() {
        List<StaffAllocation> staffAllocations = staffAllocationService.getAllStaffAllocations();
        return new ResponseEntity<>(staffAllocations, HttpStatus.OK);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<StaffAllocation> findStaffAllocationById(@PathVariable("id") UUID id) {
        StaffAllocation staffAllocation = staffAllocationService.getStaffAllocationByStaffAllocationId(id);
        return new ResponseEntity<>(staffAllocation,HttpStatus.OK);
    }

}
