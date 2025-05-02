// notfound.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '../admin/components/app.floatingconfigurator';
import { Router } from '@angular/router';
import { AuthStateService } from '../../service/auth-state.service';

@Component({
    selector: 'app-notfound',
    standalone: true,
    imports: [RouterModule, AppFloatingConfigurator, ButtonModule],
    template: `
        <app-floating-configurator />
        <div class="flex items-center justify-center min-h-screen overflow-hidden p-4 bg-white dark:bg-gray-900">
            <div class="flex flex-col items-center justify-center text-center">
                <!-- SVG Icon -->
                <svg width="80" height="80" fill="none" viewBox="0 0 54 40" xmlns="http://www.w3.org/2000/svg" class="mb-6 text-primary">
                    <!-- Your SVG content here (for brevity, you can paste the full SVG from your earlier message) -->
                    <path fill="var(--primary-color)" d="..." />
                </svg>

                <!-- 404 Message -->
                <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">Page Not Found</h1>
                <p class="text-gray-500 dark:text-gray-300 mb-6">Sorry, the page you are looking for doesn’t exist or has been moved.</p>

                <!-- Back to Home Button -->

                <p-button label="Back To Home" (click)="navigateToHome()" />
            </div>
        </div>
    `,
    styles: [``]
})
export class NotFound {
    constructor(private router: Router, private authStateService : AuthStateService) {}

    navigateToHome() {
        const role = this.authStateService.getRole();;
        if (role === 'ADMIN') {
            this.router.navigate(['/admin']);
        } else if (role === 'DOCTOR') {
            this.router.navigate(['/doctor']);
        } else if (role === 'STAFF') {
            this.router.navigate(['/staff']);
        } else if (role === 'PATIENT') {
            this.router.navigate(['/patient']);
        } else {
            this.router.navigate(['/notfound']);
        }
    }
}
