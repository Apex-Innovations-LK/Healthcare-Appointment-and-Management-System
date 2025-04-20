import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../service/auth.service';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-waiting-approval',
  standalone: true,
  imports: [ButtonModule, NgIf],
  templateUrl: './waiting-approval.component.html',
  styleUrls: ['./waiting-approval.component.css'],
})
export class WaitingApprovalComponent implements OnInit {
  userStatus: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    const username = sessionStorage.getItem('username');
    if (!username) {
      console.error('Username not found in session storage');
      return;
    }

    this.authService.getUser(username).subscribe(
      (data) => {
        this.userStatus = data.status;
        const userData = {
          username: data.username,
          role: data.role,
          status: data.status
        }
        sessionStorage.setItem('userData', JSON.stringify(userData));
        console.log('User status:', this.userStatus);
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }

  navigateToDashboard(): void {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    if (userData.role === 'DOCTOR') {
      this.router.navigate(['/doctor-dashboard']);
    } else {
      this.router.navigate(['/staff-dashboard']);
    }
  }
}
