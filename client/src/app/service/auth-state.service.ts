<<<<<<< HEAD
import { Injectable } from '@angular/core';
=======
// src/app/services/auth-state.service.ts
import { Injectable, OnInit } from '@angular/core';
>>>>>>> d9359364b1b2e581e9b020d35bc5e61addd79f4f
import { JwtPayload, TokenDecoderService } from './token-decoder.service';
import { AuthService } from './auth.service';
import { User } from '../models/user';
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
    private user: UserDetails | null = null;

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

    getUserDetails(): UserDetails | null {
        return this.user;
    }

    getUsername(): string | null {
        return this.userInfo?.sub || null;
    }

    getRole(): string | null {
        return this.getUserDetails()?.role || null;
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
                console.log("currently logged user", data);
                this.user = data;
            });
        }
    }
}
