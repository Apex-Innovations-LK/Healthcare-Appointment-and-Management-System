package manager.resources.resource_manage_service.model;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "resources", schema = "resource_manager")
public class Resource implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false , updatable = false)
    private Long resourceId;

    private String name;
    private String type;
    private String department;
    private String description;
    private String status;
    private LocalDateTime createdTime;

    //Constructors
    public Resource() {

    }

    public Resource(String name , String type , String department, String description ) {
        this.name = name;
        this.type = type;
        this.department = department;
        this.description = description;
    }

    @PrePersist
    protected void onCreate() {
        this.createdTime = LocalDateTime.now();
        this.status = "Available";
    }

    //Getters and Setters
    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }

    @Override
    public String toString() {
        return "Resource{" +
                "resourceId=" + resourceId +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", department='" + department + '\'' +
                ", description='" + description + '\'' +
                ", status='" + status + '\'' +
                ", createdTime=" + createdTime +
                '}';
    }


}
