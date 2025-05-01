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

  registerUser() {
    this.authService.registerUser(this.user).subscribe(
      (data) => {
        console.log(data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Signup successful!',
        });
        sessionStorage.setItem('token', data.token);
        if (this.user.role === "Staff" || this.user.role === "Doctor") {
          this.router.navigate(['/waiting-approval']);
        }
        this.router.navigate(['/home']);
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
        sessionStorage.setItem('token', data.token);
        this.router.navigate(['/home']);
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
