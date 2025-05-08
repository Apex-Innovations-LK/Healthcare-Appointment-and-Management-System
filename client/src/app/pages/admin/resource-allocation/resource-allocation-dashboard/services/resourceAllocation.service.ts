import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResourceAllocation } from "../models/resourceAllocation.model";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})

export class ResourceAllocationService {
    private apiServerUrl = "http://localhost:8080/resource-allocation"; // Replace with your API server URL

    constructor(private http: HttpClient) {}

    public getAllResourceAllocations(): Observable<ResourceAllocation[]> {
        return this.http.get<ResourceAllocation[]>(`${this.apiServerUrl}/all`);
    }

}