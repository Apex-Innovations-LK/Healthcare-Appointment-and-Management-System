import { Resource } from '../../resources/models/resource.model';
export interface SessionResourceDetail {
    allocation_id: string;
    sessionId: string;
    resources: Resource[];
    from: Date;
    to: Date;
    duration: number;
}