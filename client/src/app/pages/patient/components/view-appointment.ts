import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from '../../../service/appointment.service';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../../models/Appointment';
import { DoctorSessions } from '../../../models/DoctorSessions';
import { UserDetails } from '../../../models/userDetails';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthStateService } from '../../../service/auth-state.service';
import { AuthService } from '../../../service/auth.service';
import { ViewAppointmentComponent as AppointmentViewer } from './view-appointmentcomponent';

@Component({
    selector: 'app-view-appointments',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
    template: `
        <app-view-appointment></app-view-appointment>
    `
})
export class ViewAppointmentComponent implements OnInit {
    bookedAppointments: Appointment[] = [];
    doctorSessions: DoctorSessions[] = [];
    doctorDetails: UserDetails | null = null; // Store doctor details
    loading = true;
    error: string | null = null;

    constructor(
        private appointmentsService: AppointmentsService, 
        private authStateService: AuthStateService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        const token = sessionStorage.getItem('token');
        if (token) {
            const patientId = this.authStateService.getUserDetails()?.id;            
            if (patientId) {
                const appointmentViewer = new AppointmentViewer(this.appointmentsService, this.authService);
                appointmentViewer.fetchAppointments(patientId);
            } else {
                this.error = 'Unable to retrieve patient ID from token. Please log in again.';
                this.loading = false;
            }
        } else {
            this.error = 'No session token found. Please log in.';
            this.loading = false;
        }
    }
}
