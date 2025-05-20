// src/app/services/auth-state.service.ts
import { Injectable, OnInit } from '@angular/core';
import { JwtPayload, TokenDecoderService } from './token-decoder.service';
import { AuthService } from './auth.service';
import { UserDetails } from '../models/userDetails';

@Injectable({
    providedIn: 'root'
})
export class AuthStateService implements OnInit {
    ngOnInit(): void {
        this.loadUserFromToken();
        this.fetchUserInfo();
    }

    private userInfo: JwtPayload | null = null;
    private userDetails: UserDetails | null = null;

    constructor(
        private tokenDecoder: TokenDecoderService,
        private authService: AuthService
    ) {
        this.loadUserFromToken();
        this.fetchUserInfo();
    }

    loadUserFromToken() {
        this.userInfo = this.tokenDecoder.getDecodedToken();
    }

    getUser(): JwtPayload | null {
        return this.userInfo;
    }

    getUsername(): string | null {
        return this.userInfo?.sub || null;
    }

    isAuthenticated(): boolean {
        return !!this.userInfo;
    }

    clear(): void {
        this.userInfo = null;
        localStorage.removeItem('token');
    }

    getUserDetails(): UserDetails | null {
        return this.userDetails;
    }

    getRole(): string | null {
        return this.getUserDetails()?.role || null;
    }

    fetchUserInfo(username?: string): void {
        const userToFetch = username || this.getUsername() || '';
        if (userToFetch) {
            this.authService.getUser(userToFetch).subscribe((data) => {
                console.log('currently logged user', data);
                this.userDetails = data;
            });
        }
    }
}
