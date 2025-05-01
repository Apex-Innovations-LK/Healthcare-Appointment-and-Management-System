import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

interface QuickStat {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

interface UpcomingAppointment {
  doctorName: string;
  department: string;
  date: string;
  time: string;
}

interface Doctor {
  id: string; 
  speciality: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    gender: string;
    date_of_birth: string;
    phone_number: string;
    role: string;
    status: string;
    username: string;
  };
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  userName: string = '';
  private jwtHelper = new JwtHelperService();

  doctors: Doctor[] = [];

  quickStats: QuickStat[] = [
    {
      label: 'Upcoming Appointments',
      value: 3,
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      color: 'blue',
    },
    {
      label: 'Completed Appointments',
      value: 12,
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'green',
    },
  ];

  upcomingAppointments: UpcomingAppointment[] = [
    {
      doctorName: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      date: '2024-03-15',
      time: '10:30 AM',
    },
    {
      doctorName: 'Dr. Michael Chen',
      department: 'Dentistry',
      date: '2024-03-18',
      time: '2:15 PM',
    },
    {
      doctorName: 'Dr. Emily Davis',
      department: 'General Medicine',
      date: '2024-03-20',
      time: '11:00 AM',
    },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const userId = decodedToken.id;

      this.userName = decodedToken.sub;

      // Create headers with authorization token
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });

      // Get username directly from the auth service
      // this.http
      //   .get(`http://localhost:8080/api/auth/username/${userId}`, {
      //     headers: headers,
      //     responseType: 'text',
      //   })
      //   .subscribe({
      //     next: (username: string) => {
      //       console.log('Received username:', username);
      //       if (username && username.trim() !== '') {
      //         this.userName = username;
      //       } else {
      //         console.warn('Received empty username');
      //         this.userName = 'User';
      //       }
      //     },
      //     error: (error) => {
      //       console.error('Error fetching username:', error);
      //       // Try to get username from token if available
      //       if (decodedToken.sub) {
      //         this.userName = decodedToken.sub;
      //       } else {
      //         this.userName = 'User';
      //       }
      //     },
      //   });

      this.http
        .get<Doctor[]>(`http://localhost:8080/api/auth/doctors`, { headers })
        .subscribe({
          next: (doctors) => {
            if (Array.isArray(doctors)) {
              this.doctors = doctors;
              console.log('Fetched doctors:', doctors);
            } else {
              console.warn('Unexpected response format for doctors:', doctors);
            }
          },
          error: (err) => {
            console.error('Failed to fetch doctors:', err);
            if (err.status === 401) {
              console.error('Unauthorized access. Please check the token.');
            } else if (err.status === 404) {
              console.error('Doctors endpoint not found.');
            } else {
              console.error('An unexpected error occurred:', err.message);
            }
          },
        });
    }
  }
}
