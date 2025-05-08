import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { SessionResourceDetail } from "../models/sessionResourceDetail.model";

@Injectable({
    providedIn: 'root',
})
export class SessionResourceDetailService{
    private apiServerUrl = 'http://localhost:8080/resource-allocation'; // Replace with your API server URL

    constructor(private http: HttpClient) {}

    public getSessionResourceDetail(sessionId: string): Observable<SessionResourceDetail> {
        return this.http.get<SessionResourceDetail>(`${this.apiServerUrl}/find/${sessionId}`);
    }

}