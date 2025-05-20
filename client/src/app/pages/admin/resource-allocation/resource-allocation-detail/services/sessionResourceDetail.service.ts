import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { SessionResourceDetail } from "../models/sessionResourceDetail.model";
import { AvailableResources } from "../models/availableResources.model";
import { ResourceAllocation } from "../../resource-allocation-dashboard/resourceAllocation";

@Injectable({
    providedIn: 'root',
})
export class SessionResourceDetailService{
    private apiServerUrl = 'http://35.184.60.72:8080/api/resource/resource-allocation'; // Replace with your API server URL

    constructor(private http: HttpClient) {}

    public getSessionResourceDetail(sessionId: string): Observable<SessionResourceDetail> {
        return this.http.get<SessionResourceDetail>(`${this.apiServerUrl}/find/${sessionId}`);
    }

    public getAvailableResources(from: string, to: string): Observable<AvailableResources> {
        return this.http.get<AvailableResources>(`${this.apiServerUrl}/available/${from}/${to}`);
    }

    public addResourceToSession(resourceAllocation: ResourceAllocation): Observable<ResourceAllocation> {
        return this.http.post<ResourceAllocation>(`${this.apiServerUrl}/add`, resourceAllocation);
    }

    public deleteResourceFromSession(  sessionId: string , resourceId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/delete/${sessionId}/${resourceId}`);
    }

}