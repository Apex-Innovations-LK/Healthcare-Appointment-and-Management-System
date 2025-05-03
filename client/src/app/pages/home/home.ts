import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { AuthStateService } from '../../service/auth-state.service'; // Adjust if needed

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, DividerModule],
  template: `
    <div>
        <h1>Home Works!</h1>
    </div>
  `,
  styles: []
})
export class HomeComponent {
//   constructor(
//     private router: Router,
//     public authStateService: AuthStateService
//   ) {}

//   ngOnInit(): void {
//     if (this.authStateService.isAuthenticated()) {
//       const role = this.authStateService.getRole();
//       switch (role) {
//         case 'doctor':
//           this.router.navigate(['/doctor/home']);
//           break;
//         case 'admin':
//           this.router.navigate(['/admin/home']);
//           break;
//         case 'patient':
//           this.router.navigate(['/patient/home']);
//           break;
//         default:
//           this.router.navigate(['/login']);
//       }
//     }
//   }

//   goToLogin() {
//     this.router.navigate(['/auth/login']);
//   }
}
