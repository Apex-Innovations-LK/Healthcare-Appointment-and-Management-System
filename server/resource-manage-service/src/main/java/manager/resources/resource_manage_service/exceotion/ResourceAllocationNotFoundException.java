package manager.resources.resource_manage_service.exceotion;

public class ResourceAllocationNotFoundException extends RuntimeException{
    public ResourceAllocationNotFoundException(String message){
        super(message);
    }
}
