import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
// import { JwtHelperService } from '@auth0/angular-jwt';

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
  selector: 'app-add-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './add-appointment.component.html',
})
export class AddAppointmentComponent implements OnInit {
  selectedDoctor: string = '';
  selectedDate: string = '';
  doctors: { id: string; name: string }[] = [];

  private http = inject(HttpClient);
//   private jwtHelper = new JwtHelperService();

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.fetchDoctors();

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as {
      doctorId?: string;
      date?: string;
    };

    if (state) {
      this.selectedDoctor = state.doctorId || '';
      this.selectedDate = state.date || '';
    }

    this.route.queryParams.subscribe((params) => {
      if (params['doctorId']) this.selectedDoctor = params['doctorId'];
      if (params['date']) this.selectedDate = params['date'];
    });
  }

  fetchDoctors() {
    const token = sessionStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });

      this.http.get<Doctor[]>('http://localhost:8080/api/auth/doctors', { headers }).subscribe({
        next: (data) => {
          this.doctors = data.map((d) => ({
            id: d.id,
            name: `Dr. ${d.user.first_name} ${d.user.last_name}`,
          }));
        },
        error: (err) => {
          console.error('Failed to fetch doctors:', err);
        },
      });
    } else {
      console.error('No token found in session storage.');
    }
  }

//   checkDoctorAvailability() {
//     const token = sessionStorage.getItem('token');
//     if (!this.selectedDoctor || !this.selectedDate) {
//       alert('Please select a doctor and date.');
//       return;
//     }
  
//     const headers = new HttpHeaders({
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     });
  
//     const url = `http://localhost:8082/api/schedule/check-availability?doctorId=${this.selectedDoctor}&date=${this.selectedDate}`;
  
//     this.http.get<{ available: boolean }>(url, { headers }).subscribe({
//       next: (res) => {
//         if (res.available) {
//           alert('Doctor is available. Proceed to submit appointment.');
//           this.onSubmit();
//         } else {
//           alert('Doctor is not available on the selected date. Please choose another date.');
//         }
//       },
//       error: (err) => {
//         console.error('Error checking availability:', err);
//         alert('Something went wrong while checking availability.');
//       },
//     });
//   }
  
  onSubmit() {
    const selectedDoctorName = this.doctors.find(doc => doc.id === this.selectedDoctor)?.name || '';
    this.router.navigate(['/appointments/confirmation'], {
      queryParams: {
        doctorId: this.selectedDoctor,
        doctorName: selectedDoctorName,
        date: this.selectedDate,
      },
    });
  }
  
  onCancel() {
    window.history.back();
  }
}