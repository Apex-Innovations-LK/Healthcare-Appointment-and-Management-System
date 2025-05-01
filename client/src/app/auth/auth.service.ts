import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    getUserId(): number {
        // Example: Retrieve user ID from local storage or JWT token
        return Number(localStorage.getItem('userId'));
    }
}