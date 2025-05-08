import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { Doctor } from '../models/doctor';
import { UserDetails } from '../models/userDetails';

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


    getUser(username: String): Observable<UserDetails> {
        return this.httpClient.post<UserDetails>(`${this.baseURL}/get-user`, username);
    }

    getCount(): Observable<Object> {
        return this.httpClient.get<Object>(`${this.baseURL}/get-count`);
    }


    getDoctors(): Observable<Doctor[]> {
        return this.httpClient.get<Doctor[]>(`${this.baseURL}/fetch-doctors`);
    }
}
