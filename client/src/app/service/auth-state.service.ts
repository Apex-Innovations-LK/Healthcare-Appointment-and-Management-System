import { Injectable } from '@angular/core';
import { JwtPayload, TokenDecoderService } from './token-decoder.service';

@Injectable({
    providedIn: 'root'
})
export class AuthStateService {
    private userInfo: JwtPayload | null = null;

    constructor(private tokenDecoder: TokenDecoderService) {
        this.loadUserFromToken();
    }

    private loadUserFromToken() {
        this.userInfo = this.tokenDecoder.getDecodedToken();
    }

    getUser(): JwtPayload | null {
        return this.userInfo;
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
}
