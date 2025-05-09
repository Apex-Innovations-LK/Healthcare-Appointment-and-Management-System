package manager.resources.resource_manage_service.service;

import manager.resources.resource_manage_service.model.StaffAllocation;
import manager.resources.resource_manage_service.model.StaffUtilizationOverallDto;
import manager.resources.resource_manage_service.repo.StaffAllocationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StaffAllocationService {

    private final StaffAllocationRepo staffAllocationRepo;

    @Autowired
    public StaffAllocationService(StaffAllocationRepo staffAllocationRepo) {
        this.staffAllocationRepo = staffAllocationRepo;
    }

    public StaffAllocation addStaffAllocation(StaffAllocation staffAllocation) {
        return staffAllocationRepo.save(staffAllocation);
    }

    public StaffUtilizationOverallDto getStaffUtilizationOverall() {

        List<StaffAllocation> allStaffAllocations = staffAllocationRepo.findAll();

// Group by staffId
        Map<UUID, List<StaffAllocation>> allocationsByStaff = allStaffAllocations.stream()
                .collect(Collectors.groupingBy(StaffAllocation::getStaffId));

        int totalStaffMembers = allocationsByStaff.size();

        float totalUtil = 0f;
        float doctorUtilTotal = 0f;
        int doctorCount = 0;
        float staffUtilTotal = 0f;
        int staffCount = 0;
        int overUtilizedCount = 0;

        int low = 0, normal = 0, high = 0;

        for (Map.Entry<UUID, List<StaffAllocation>> entry : allocationsByStaff.entrySet()) {
            List<StaffAllocation> staffAllocList = entry.getValue();

            // Average utilization for this staff
            float avgUtil = (float) staffAllocList.stream()
                    .mapToDouble(StaffAllocation::getUtilization)
                    .average()
                    .orElse(0.0);

            totalUtil += avgUtil;

            // Classify utilization state
            if (avgUtil < 50) {
                low++;
            } else if (avgUtil <= 80) {
                normal++;
            } else {
                high++;
                overUtilizedCount++;
            }

//            if (avgUtil > 85) {
//                overUtilizedCount++;
//            }

            // Use role from first allocation (assuming consistent role per staffId)
            String role = staffAllocList.get(0).getRole();
            if (role.equalsIgnoreCase("Doctor")) {
                doctorUtilTotal += avgUtil;
                doctorCount++;
            } else {
                staffUtilTotal += avgUtil;
                staffCount++;
            }
        }

// Final calculations
        float averageUtilization = totalUtil / totalStaffMembers;
        float utilizationByRoleDoctor = doctorCount > 0 ? doctorUtilTotal / doctorCount : 0f;
        float utilizationByRoleStaff = staffCount > 0 ? staffUtilTotal / staffCount : 0f;

        float lowPercent = (low * 100f) / totalStaffMembers;
        float normalPercent = (normal * 100f) / totalStaffMembers;
        float highPercent = (high * 100f) / totalStaffMembers;

        List<Float> staffStateDestribution = Arrays.asList(lowPercent, normalPercent, highPercent);
        List<String> staffStateDestributionLebal = Arrays.asList(
                "Low " + String.format("%.0f", lowPercent) + "%",
                "Normal " + String.format("%.0f", normalPercent) + "%",
                "High " + String.format("%.0f", highPercent) + "%"
        );
        StaffUtilizationOverallDto staffUtilizationOverallDto = new StaffUtilizationOverallDto(averageUtilization,overUtilizedCount,totalStaffMembers,utilizationByRoleDoctor,utilizationByRoleStaff,staffStateDestribution,staffStateDestributionLebal);
        return staffUtilizationOverallDto;
    }

    public List<StaffAllocation> getAllStaffAllocations() {
        return staffAllocationRepo.findAll();
    }
    public StaffAllocation getStaffAllocationByStaffAllocationId(UUID id){
        return staffAllocationRepo.getStaffAllocationByStaffAllocationId(id);
    }

}
