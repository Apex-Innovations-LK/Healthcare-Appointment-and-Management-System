import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthStateService } from '../auth-state.service';

@Injectable({
    providedIn: 'root'
})
export class StaffAuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authStateService: AuthStateService
    ) {}

    canActivate(): boolean {
        if (this.authStateService.isAuthenticated() && this.authStateService.getRole() === 'STAFF') {
            return true;
        } else if (!this.authStateService.isAuthenticated()) {
            this.router.navigate(['/auth/login']);
            return false;
        } else {
            this.router.navigate(['/auth/access']);
            return false;
        }
    }
}
