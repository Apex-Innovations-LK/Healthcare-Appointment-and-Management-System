// src/app/services/token-decoder.service.ts
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
    sub: string;
    role?: string;
    exp?: number;
    iat?: number;
    [key: string]: any; 
}

@Injectable({
    providedIn: 'root'
})
export class TokenDecoderService {
    decodeToken(token: string): JwtPayload | null {
        try {
            return jwtDecode<JwtPayload>(token);
        } catch (error) {
            console.error('Invalid JWT token', error);
            return null;
        }
    }

    getToken(): string | null {
        return localStorage.getItem('token'); 
    }

    getDecodedToken(): JwtPayload | null {
        const token = this.getToken();
        return token ? this.decodeToken(token) : null;
    }
}
