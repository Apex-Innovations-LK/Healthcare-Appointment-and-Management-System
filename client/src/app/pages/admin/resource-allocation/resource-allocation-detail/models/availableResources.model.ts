import { Resource } from '../../resources/models/resource.model';
export interface AvailableResources {
    equipment: Resource[];
    room: Resource[];
}