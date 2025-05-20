import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResourceAllocation } from "../models/resourceAllocation.model";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})

export class ResourceAllocationService {
    private apiServerUrl = "http://35.184.60.72:8080/api/resource"; // Replace with your API server URL

    constructor(private http: HttpClient) {}

    public getAllResourceAllocations(): Observable<ResourceAllocation[]> {
        return this.http.get<ResourceAllocation[]>(`${this.apiServerUrl}/resource-allocation/all`);
    }

    public getNumberOfResources(): Observable<number> {
        return this.http.get<number>(`${this.apiServerUrl}/count`);
    }

}