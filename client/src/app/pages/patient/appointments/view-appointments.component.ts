import { Component, OnInit } from '@angular/core';
import { AppointmentsService, Appointment } from '../appointments.service';
import { CommonModule } from '@angular/common'; 

@Component({
    selector: 'app-view-appointments',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './view-appointments.component.html' 
  })

export class ViewAppointmentsComponent implements OnInit {
  pendingAppointments: Appointment[] = [];
  completedAppointments: Appointment[] = [];
  loading = true;
  error: string | null = null;

  constructor(private appointmentsService: AppointmentsService) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    this.loading = true;
    this.error = null;

    this.appointmentsService.getAppointments().subscribe({
      next: (appointments) => {
        this.pendingAppointments = appointments.filter(
          (appointment) => appointment.status === 'PENDING'
        );
        this.completedAppointments = appointments.filter(
          (appointment) => appointment.status === 'COMPLETED'
        );
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load appointments. Please try again later.';
        this.loading = false;
      },
    });
  }

  cancelAppointment(id: number): void {
    // Add logic to cancel/delete an appointment if needed
    console.log(`Cancel appointment with ID: ${id}`);
  }
}

