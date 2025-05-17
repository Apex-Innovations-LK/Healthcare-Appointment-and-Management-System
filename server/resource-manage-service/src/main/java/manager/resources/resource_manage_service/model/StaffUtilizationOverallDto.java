package manager.resources.resource_manage_service.model;

import java.io.Serializable;
import java.util.List;

public class StaffUtilizationOverallDto implements Serializable {

    private float avarageUtilization;
    private float numberOfOverUsedStaff;
    private float totalStaffMembers;
    private float utilizationByRoleDoctor;
    private float utilizationByRoleStaff;
    private List<Float> staffStateDestribution;
    private List<String> staffStateDestributionLebal;

    // Constructor
    public StaffUtilizationOverallDto(float avarageUtilization, float numberOfOverUsedStaff, float totalStaffMembers,
                                      float utilizationByRoleDoctor, float utilizationByRoleStaff,
                                      List<Float> staffStateDestribution, List<String> staffStateDestributionLebal) {
        this.avarageUtilization = avarageUtilization;
        this.numberOfOverUsedStaff = numberOfOverUsedStaff;
        this.totalStaffMembers = totalStaffMembers;
        this.utilizationByRoleDoctor = utilizationByRoleDoctor;
        this.utilizationByRoleStaff = utilizationByRoleStaff;
        this.staffStateDestribution = staffStateDestribution;
        this.staffStateDestributionLebal = staffStateDestributionLebal;
    }

    // Getters and Setters
    public float getAvarageUtilization() {
        return avarageUtilization;
    }

    public void setAvarageUtilization(float avarageUtilization) {
        this.avarageUtilization = avarageUtilization;
    }

    public float getNumberOfOverUsedStaff() {
        return numberOfOverUsedStaff;
    }

    public void setNumberOfOverUsedStaff(float numberOfOverUsedStaff) {
        this.numberOfOverUsedStaff = numberOfOverUsedStaff;
    }

    public float getTotalStaffMembers() {
        return totalStaffMembers;
    }

    public void setTotalStaffMembers(float totalStaffMembers) {
        this.totalStaffMembers = totalStaffMembers;
    }

    public float getUtilizationByRoleDoctor() {
        return utilizationByRoleDoctor;
    }

    public void setUtilizationByRoleDoctor(float utilizationByRoleDoctor) {
        this.utilizationByRoleDoctor = utilizationByRoleDoctor;
    }

    public float getUtilizationByRoleStaff() {
        return utilizationByRoleStaff;
    }

    public void setUtilizationByRoleStaff(float utilizationByRoleStaff) {
        this.utilizationByRoleStaff = utilizationByRoleStaff;
    }

    public List<Float> getStaffStateDestribution() {
        return staffStateDestribution;
    }

    public void setStaffStateDestribution(List<Float> staffStateDestribution) {
        this.staffStateDestribution = staffStateDestribution;
    }

    public List<String> getStaffStateDestributionLebal() {
        return staffStateDestributionLebal;
    }

    public void setStaffStateDestributionLebal(List<String> staffStateDestributionLebal) {
        this.staffStateDestributionLebal = staffStateDestributionLebal;
    }

    // toString method
    @Override
    public String toString() {
        return "StaffUtilizationOverallDta{" +
                "avarageUtilization=" + avarageUtilization +
                ", numberOfOverUsedStaff=" + numberOfOverUsedStaff +
                ", totalStaffMembers=" + totalStaffMembers +
                ", utilizationByRoleDoctor=" + utilizationByRoleDoctor +
                ", utilizationByRoleStaff=" + utilizationByRoleStaff +
                ", staffStateDestribution=" + staffStateDestribution +
                ", staffStateDestributionLebal=" + staffStateDestributionLebal +
                '}';
    }
}
