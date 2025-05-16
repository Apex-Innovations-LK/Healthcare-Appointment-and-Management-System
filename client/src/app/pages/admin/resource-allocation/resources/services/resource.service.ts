import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Resource } from "../models/resource.model";
import { Observable } from "rxjs";


@Injectable({
    providedIn: "root",
})

export class ResourceService {
    private apiServerUrl = "http://localhost:8080/resource"; // Replace with your API server URL

    constructor(private http: HttpClient) {}

    public addResource(resource: Resource): Observable<Resource> {
        return this.http.post<Resource>(`${this.apiServerUrl}/add`, resource);
    }

    public getResources(): Observable<Resource[]> {
        return this.http.get<Resource[]>(`${this.apiServerUrl}/all`);
    }
    public getResourceById(id: number): Observable<Resource> {
        return this.http.get<Resource>(`${this.apiServerUrl}/find/${id}`);
    }
}
