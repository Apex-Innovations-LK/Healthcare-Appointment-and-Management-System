import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { User } from '../models/user';
import { OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  user: User = new User(
    '', // username
    '', // first_name
    '', // last_name
    new Date(), // date_of_birth
    '', // gender
    '', // role
    '', // email
    '', // phone_number
    '', // status
    '' // password
  );

  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {}

  private redirectUserBasedOnRole(
    token: string,
    username: string,
    role: string,
    status: string
  ): void {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('username', username);
    if (status === 'PENDING') {
      this.router.navigate(['/waiting-approval']);
    } else {
      const routesByRole: Record<string, string> = {
        PATIENT: '/home',
        ADMIN: '/admin-dashboard',
        DOCTOR: '/doctor-dashboard',
        STAFF: '/staff-dashboard',
      };

      const route = routesByRole[role] || '/un-Authorized';
      this.router.navigate([route]);

    }
  }

  registerUser() {
    this.authService.registerUser(this.user).subscribe(
      (data) => {
        console.log(data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Signup successful!',
        });
        this.redirectUserBasedOnRole(
          data.token,
          data.username,
          data.role,
          data.status
        );
      },
      (error) => {
        console.log('Error in creating user' + error.message);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Signup failed!',
        });
      }
    );
  }

  login() {
    this.authService.loginUser(this.user).subscribe(
      (data) => {
        console.log(data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful!',
        });
        this.redirectUserBasedOnRole(
          data.token,
          data.username,
          data.role,
          data.status
        );
      },
      (error) => {
        console.log('Error in login' + error.message);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Login failed!',
        });
      }
    );
  }

  isLogin = true;
  isNext = true;

  toggleForm() {
    this.isLogin = !this.isLogin;
  }
}
