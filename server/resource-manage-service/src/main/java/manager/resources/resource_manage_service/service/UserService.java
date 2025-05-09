package manager.resources.resource_manage_service.service;

import manager.resources.resource_manage_service.model.User;
import manager.resources.resource_manage_service.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    private final UserRepo userRepo;

    @Autowired
    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public User getUserById(UUID id) {
        return userRepo.findById(id).orElse(null);
    }

}
