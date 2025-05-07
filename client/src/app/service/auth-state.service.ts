// src/app/services/auth-state.service.ts
import { Injectable, OnInit } from '@angular/core';
import { JwtPayload, TokenDecoderService } from './token-decoder.service';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { UserDetails } from '../models/userDetails';

@Injectable({
    providedIn: 'root'
})
export class AuthStateService{

    private userInfo: JwtPayload | null = null;
    private user: UserDetails | null = null;

    constructor(
        private tokenDecoder: TokenDecoderService,
        private authService: AuthService
    ) {
        this.loadUserFromToken();
        this.fetchUserInfo();
    }

    private loadUserFromToken() {
        this.userInfo = this.tokenDecoder.getDecodedToken();
    }

    getUser(): JwtPayload | null {
        return this.userInfo;
    }

    getUserDetails(): UserDetails | null {
        return this.user;
    }

    getUsername(): string | null {
        return this.userInfo?.sub || null;
    }

    getRole(): string | null {
        return this.userInfo?.role || null;
    }

    isAuthenticated(): boolean {
        return !!this.userInfo;
    }

    clear(): void {
        this.userInfo = null;
        localStorage.removeItem('token');
    }

    fetchUserInfo(): void {
        const username = this.getUsername() || '';
        if (username) {
            this.authService.getUser(username).subscribe((data) => {
                console.log(data);
                this.user = data;
            });
        }
    }
}
