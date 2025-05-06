import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from '../../../service/appointment.service';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../../models/Appointment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
    selector: 'app-view-appointments',
    standalone: true,
    imports: [CommonModule, ],
    template: `
        <div class="min-h-screen bg-gray-50 py-8">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-8">Your Appointments</h1>

                <!-- Loading State -->
                <div *ngIf="loading" class="text-center py-8">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p class="mt-4 text-gray-600">Loading appointments...</p>
                </div>

                <!-- Error State -->
                <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                    <p class="text-red-600">{{ error }}</p>
                </div>

                <!-- Pending Appointments Section -->
                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4">
                        Pending Appointments
                        <span class="ml-2 text-sm font-medium text-gray-500">({{ pendingAppointments.length }})</span>
                    </h2>
                    <div class="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
                        <div *ngIf="pendingAppointments.length === 0" class="p-6 text-center text-gray-500">No pending appointments</div>
                        <div *ngFor="let appointment of pendingAppointments" class="p-6 hover:bg-gray-50">
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

                <!-- Completed Appointments Section -->
                <section>
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4">
                        Completed Appointments
                        <span class="ml-2 text-sm font-medium text-gray-500">({{ completedAppointments.length }})</span>
                    </h2>
                    <div class="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
                        <div *ngIf="completedAppointments.length === 0" class="p-6 text-center text-gray-500">No completed appointments</div>
                        <div *ngFor="let appointment of completedAppointments" class="p-6 hover:bg-gray-50">
                            <div class="flex items-center justify-between">
                                <div class="flex-grow">
                                    <div class="mt-2 text-sm text-gray-500 space-y-1">
                                        <p><strong>Appointment ID:</strong> {{ appointment.patient_id }}</p>
                                        <p><strong>Patient ID:</strong> {{ appointment.slotId }}</p>
                                        <p><strong>Status:</strong> {{ appointment.status }}</p>
                                        <p><strong>Appointment Type:</strong> {{ appointment.appointment_type }}</p>
                                        <p><strong>Notes:</strong> {{ appointment.notes }}</p>
                                    </div>
                                </div>
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"> Completed </span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    `
})
export class ViewAppointmentComponent implements OnInit {
    pendingAppointments: Appointment[] = [];
    completedAppointments: Appointment[] = [];
    loading = true;
    error: string | null = null;

    constructor(
        private appointmentsService: AppointmentsService,
        private jwtHelper: JwtHelperService
    ) {}

    // ngOnInit(): void {
    //     const token = sessionStorage.getItem('token');

    //     if (token) {
    //         const decodedToken = this.jwtHelper.decodeToken(token);
    //         const patientId = decodedToken?.id;

    //         if (patientId) {
    //             this.fetchAppointments(patientId);
    //         } else {
    //             this.error = 'Unable to retrieve patient ID from token. Please log in again.';
    //             this.loading = false;
    //         }
    //     } else {
    //         this.error = 'No session token found. Please log in.';
    //         this.loading = false;
    //     }
    // }

    ngOnInit(): void {
        // Temporary fix for debugging
        const patientId = 'cdf3cd99-2154-44b6-bb5a-6600e894769b';
        this.fetchAppointments(patientId);
    }
    

    fetchAppointments(patientId: string): void {
        this.loading = true;
        this.error = null;

        this.appointmentsService.viewAppointments(patientId).subscribe({
            next: (appointments) => {
                this.pendingAppointments = appointments.filter((appointment) => appointment.status === 'BOOKED');
                this.completedAppointments = appointments.filter((appointment) => appointment.status === 'AVAILABLE');
                this.loading = false;
            },
            error: () => {
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
