import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from '../../../service/appointment.service';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../../models/Appointment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-view-appointments',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, HttpClientModule ],
    template: `
        <div class="min-h-screen bg-gray-50 py-8">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-8">Appointment History and Status</h1>

                <!-- Loading State -->
                <div *ngIf="loading" class="text-center py-8">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p class="mt-4 text-gray-600">Loading appointments...</p>
                </div>

                <!-- Error State -->
                <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                    <p class="text-red-600">{{ error }}</p>
                </div>

                <!-- Appointments Section -->
                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4">
                        Your Appointments
                        <span class="ml-2 text-sm font-medium text-gray-500">({{ bookedAppointments.length }})</span>
                    </h2>
                    <div class="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
                        <div *ngIf="bookedAppointments.length === 0" class="p-6 text-center text-gray-500">No appointments</div>
                        <div *ngFor="let appointment of bookedAppointments" class="p-6 hover:bg-gray-50">
                            <div class="flex items-center justify-between">
                                <div class="flex-grow">
                                    <div class="mt-2 text-sm text-gray-500 space-y-1">
                                        <p><strong>Patient ID:</strong> {{ appointment.patient_id }}</p>
                                        <p><strong>Slot ID:</strong> {{ appointment.slotId }}</p>
                                        <p><strong>Status:</strong> {{ appointment.status }}</p>
                                        <p><strong>Appointment Type:</strong> {{ appointment.appointment_type }}</p>
                                        <p><strong>Notes:</strong> {{ appointment.notes }}</p>
                                    </div>
                                </div>
                                <button
                                    (click)="cancelAppointment(appointment.appointment_id)"
                                    class="ml-4 px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    `
})
export class ViewAppointmentComponent implements OnInit {
    bookedAppointments: Appointment[] = [];
    loading = true;
    error: string | null = null;

    constructor(
        private appointmentsService: AppointmentsService,
    ) {}

    decodeToken(token: string): any {
        try {
          const payload = token.split('.')[1];
          const decodedPayload = atob(payload);
          return JSON.parse(decodedPayload);
        } catch (error) {
          console.error('Token decoding failed', error);
          return null;
        }
      }

    ngOnInit(): void {
        const token = sessionStorage.getItem('token');
      
        if (token) {
          const decodedToken = this.decodeToken(token);
          const patientId = decodedToken?.id;
      
          if (patientId) {
            this.fetchAppointments(patientId);
          } else {
            this.error = 'Unable to retrieve patient ID from token. Please log in again.';
            this.loading = false;
          }
        } else {
          this.error = 'No session token found. Please log in.';
          this.loading = false;
        }
      }

    // ngOnInit(): void {
    //     // Temporary fix for debugging
    //     const patientId = 'cdf3cd99-2154-44b6-bb5a-6600e894769b';
    //     this.fetchAppointments(patientId);
    // }

    fetchAppointments(patientId: string): void {
        this.loading = true;
        this.error = null;
    
        this.appointmentsService.viewAppointments(patientId).subscribe({
            next: (appointments) => {
                console.log('Fetched appointments:', appointments);
                this.bookedAppointments = appointments; 
                this.loading = false;
            },
            error: (error) => {
                console.error('Fetch error:', error);
                this.error = 'Failed to load appointments. Please try again later.';
                this.loading = false;
            }
        });
    }

    cancelAppointment(id: number): void {
        console.log(`Cancel appointment with ID: ${id}`);
        // Implement cancel/delete logic here if required
    }
}
