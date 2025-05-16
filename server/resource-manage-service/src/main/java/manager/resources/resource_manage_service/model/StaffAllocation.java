package manager.resources.resource_manage_service.model;


import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "staff_allocations" ,schema = "resource_manager")
public class StaffAllocation implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID staffAllocationId;

    private UUID staffId;
    private String name;
    private String role;
    private Date date;
    private float scheduleTime;
    private float overtime;
    private float idle_time;
    private float active_time;
    private float utilization;
    private String status;

    public StaffAllocation() {
    }

    public StaffAllocation(UUID staffId, String name, String role, Date date,
                           float scheduleTime, float overtime, float idle_time,
                           float active_time, float utilization, String status) {
        this.staffId = staffId;
        this.name = name;
        this.role = role;
        this.date = date;
        this.scheduleTime = scheduleTime;
        this.overtime = overtime;
        this.idle_time = idle_time;
        this.active_time = active_time;
        this.utilization = utilization;
        this.status = status;
    }

    public UUID getStaffAllocationId() {
        return staffAllocationId;
    }

    public void setStaffAllocationId(UUID staffAllocationId) {
        this.staffAllocationId = staffAllocationId;
    }

    public UUID getStaffId() {
        return staffId;
    }

    public void setStaffId(UUID staffId) {
        this.staffId = staffId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public float getScheduleTime() {
        return scheduleTime;
    }

    public void setScheduleTime(float scheduleTime) {
        this.scheduleTime = scheduleTime;
    }

    public float getOvertime() {
        return overtime;
    }

    public void setOvertime(float overtime) {
        this.overtime = overtime;
    }

    public float getIdle_time() {
        return idle_time;
    }

    public void setIdle_time(float idle_time) {
        this.idle_time = idle_time;
    }

    public float getActive_time() {
        return active_time;
    }

    public void setActive_time(float active_time) {
        this.active_time = active_time;
    }

    public float getUtilization() {
        return utilization;
    }

    public void setUtilization(float utilization) {
        this.utilization = utilization;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "StaffAllocations{" +
                "staffAllocationId=" + staffAllocationId +
                ", staffId=" + staffId +
                ", name='" + name + '\'' +
                ", role='" + role + '\'' +
                ", date=" + date +
                ", scheduleTime=" + scheduleTime +
                ", overtime=" + overtime +
                ", idle_time=" + idle_time +
                ", active_time=" + active_time +
                ", utilization=" + utilization +
                ", status='" + status + '\'' +
                '}';
    }

}
