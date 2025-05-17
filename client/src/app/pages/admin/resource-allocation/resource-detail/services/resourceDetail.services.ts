import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})

export class ResourceDetailService {
    private apiServerUrl = 'http://localhost:8081/resource-allocation'; // Replace with your API server URL

    constructor(private http: HttpClient) {}

    public getSessionResourceDetail(from: Date, to: Date): Observable<any> {
        return this.http.get<any>(`${this.apiServerUrl}/available/${from}/${to}`);
    }

}