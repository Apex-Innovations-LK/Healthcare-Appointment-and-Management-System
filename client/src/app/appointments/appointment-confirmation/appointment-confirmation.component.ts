import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-appointment-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './appointment-confirmation.component.html'
})
export class AppointmentConfirmationComponent implements OnInit {
  doctorId: string = '';
  date: string = '';
  selectedDoctor: any;

  // Sample doctors list - replace with actual data from your backend
  doctors = [
    { id: '1', name: 'Dr. John Smith' },
    { id: '2', name: 'Dr. Sarah Johnson' },
    { id: '3', name: 'Dr. Michael Brown' },
    { id: '4', name: 'Dr. Emily Davis' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.doctorId = params['doctorId'];
      this.date = params['date'];
      const doctorName = params['doctorName'];
      this.selectedDoctor = doctorName || this.doctors.find(doc => doc.id === this.doctorId)?.name;
    });
  }

  onSubmit() {
    // Add your logic to save the appointment
    console.log('Submitting appointment:', {
      doctorId: this.doctorId,
      date: this.date
    });
    // Navigate to success page or show confirmation message
    // For now, we'll navigate back to home
    this.router.navigate(['/home']);
  }

  onBack() {
    // Navigate back to add appointment with preserved state
    this.router.navigate(['/appointments/add'], {
      queryParams: {
        doctorId: this.doctorId,
        date: this.date
      }
    });
  }
} 