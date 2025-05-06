import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseURL = 'http://localhost:8080/api/auth';

    constructor(private httpClient: HttpClient) {}

    registerUser(user: User): Observable<AuthResponse> {
        return this.httpClient.post<AuthResponse>(`${this.baseURL}/register`, user);
    }

    loginUser(user: User): Observable<AuthResponse> {
        return this.httpClient.post<AuthResponse>(`${this.baseURL}/login`, user);
    }

    getUser(username: String): Observable<User> {
        return this.httpClient.post<User>(`${this.baseURL}/get-user`, username);
    }

    getCount(): Observable<Object> {
        return this.httpClient.get<Object>(`${this.baseURL}/get-count`);
    }
}
