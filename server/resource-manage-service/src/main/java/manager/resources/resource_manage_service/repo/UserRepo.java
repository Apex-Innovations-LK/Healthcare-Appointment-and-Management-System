package manager.resources.resource_manage_service.repo;

import manager.resources.resource_manage_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepo extends JpaRepository<User, UUID> {

}
