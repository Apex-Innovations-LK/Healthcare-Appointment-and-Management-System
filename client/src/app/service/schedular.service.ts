import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { Schedule } from '../models/schedule';

@Injectable({
    providedIn: 'root'
})
export class SchedularService {
    private baseURL = 'http://localhost:8080/api/schedule';

    constructor(private httpClient: HttpClient) {}

    runSchedular(): Observable<String> {
        return this.httpClient.get<String>(`${this.baseURL}/run`);
    }

    getCount(): Observable<Object> {
        return this.httpClient.get<Object>(`${this.baseURL}/get-count`)
    }

    getSchedule(staff_id: string):Observable<Schedule[]> {
        return this.httpClient.post<Schedule[]>(`${this.baseURL}/get-schedule`, staff_id)
    }
}
