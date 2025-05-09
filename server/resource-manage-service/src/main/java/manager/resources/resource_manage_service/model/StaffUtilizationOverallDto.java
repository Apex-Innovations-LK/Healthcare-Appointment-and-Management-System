package manager.resources.resource_manage_service.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.io.Serializable;
import java.util.List;

public class StaffUtilizationOverallDta implements Serializable {

    private float avarageUtilization;
    private float numberOfOverUsedStaff;
    private float totalStaffMembers;
    private float utilizationByRoleDoctor;
    private float utilizationByRoleStaff;
    private List<Float> staffStateDestribution;
    private List<String> staffStateDestributionLebal;

}
