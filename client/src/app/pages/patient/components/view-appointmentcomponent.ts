import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from '../../../service/appointment.service';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../../models/Appointment';
import { DoctorSessions } from '../../../models/DoctorSessions';
import { UserDetails } from '../../../models/userDetails';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../service/auth.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-view-appointments',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
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
                                        <p><strong>Doctor Name:</strong> Dr. {{ getDoctorInfo(appointment.session_id)?.first_name }} {{ getDoctorInfo(appointment.session_id)?.last_name }}</p>
                                        <p><strong>Speciality:</strong> {{ getDoctorInfo(appointment.session_id)?.speciality || 'N/A' }}</p>
                                        <p><strong>License Number:</strong> {{ getDoctorInfo(appointment.session_id)?.license_number || 'N/A' }}</p>
                                        <p><strong>Doctor ID:</strong> {{ getDoctorDetails(appointment.session_id)?.doctor_id || 'N/A' }}</p>
                                        <p><strong>From:</strong> {{ getDoctorDetails(appointment.session_id)?.from | date: 'shortTime' }}</p>
                                        <p><strong>To:</strong> {{ getDoctorDetails(appointment.session_id)?.to | date: 'shortTime' }}</p>
                                        <p><strong>Status:</strong> {{ appointment.status }}</p>
                                        <p><strong>Appointment Type:</strong> {{ appointment.appointment_type }}</p>
                                    </div>
                                </div>
                                <button
                                    (click)="cancelAppointment(appointment.slot_id || appointment.slotId)"
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
    doctorSessions: DoctorSessions[] = [];
    doctorDetailsMap: Map<string, UserDetails> = new Map();
    loading = true;
    error: string | null = null;
  
    constructor(
        private appointmentsService: AppointmentsService,
        private authService: AuthService
    ) {}
  
    decodeToken(token: string): any {
      try {
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        const decoded = JSON.parse(decodedPayload);
        console.log('Decoded token:', decoded);
        return decoded;
      } catch (error) {
        console.error('Token decoding failed', error);
        return null;
      }
    }
  
    ngOnInit(): void {
      const token = localStorage.getItem('token');
      
      if (token) {
        const decodedToken = this.decodeToken(token);
        const username = decodedToken?.sub;
  
        if (username) {
          // Get user details from auth service
          this.authService.getUser(username).subscribe({
            next: (userDetails: UserDetails) => {
              if (userDetails && userDetails.id) {
                this.fetchAppointments(userDetails.id);
              } else {
                this.error = 'Unable to retrieve patient details. Please log in again.';
                this.loading = false;
              }
            },
            error: (error: any) => {
              console.error('Error fetching user details:', error);
              this.error = 'Failed to load user details. Please try again.';
              this.loading = false;
            }
          });
        } else {
          this.error = 'Unable to retrieve username from token. Please log in again.';
          this.loading = false;
        }
      } else {
        this.error = 'No session token found. Please log in.';
        this.loading = false;
      }
    }

    fetchAppointments(patientId: string): void {
        this.loading = true;
        this.error = null;
  
        // Fetch patient appointments first
        this.appointmentsService.viewAppointments(patientId).pipe(
            switchMap(appointments => {
                console.log('Raw appointments from backend:', appointments);
                this.bookedAppointments = appointments.map(app => {
                    console.log('Processing appointment:', app);
                    const slotId = app.slot_id || app.slotId;
                    if (!slotId) {
                        console.error('Appointment missing slot_id:', app);
                    }
                    return new Appointment(
                        app.appointment_id,
                        app.patient_id,
                        app.session_id,
                        slotId || '',  // Provide empty string as fallback
                        app.status,
                        app.appointment_type,
                        app.notes || ''
                    );
                });
                console.log('Processed appointments:', this.bookedAppointments);
  
                if (appointments.length === 0) {
                    console.log('No appointments found');
                    return of([]);
                }
  
                // For each appointment, get the session details
                const sessionObservables = appointments.map(appointment =>
                    this.appointmentsService.getSessionDetails(appointment.session_id).pipe(
                        catchError(error => {
                            console.error(`Error fetching session ${appointment.session_id}:`, error);
                            return of(null);
                        })
                    )
                );
  
                return forkJoin(sessionObservables);
            }),
            switchMap(sessions => {
                console.log('All session details:', sessions);
                this.doctorSessions = sessions.filter(session => session !== null) as DoctorSessions[];
  
                if (this.doctorSessions.length === 0) {
                    this.error = 'No session details found for appointments.';
                    return of([]);
                }
  
                // Get doctor details for each session
                const doctorObservables = this.doctorSessions.map(session =>
                    this.appointmentsService.getDoctorDetails(session.doctor_id).pipe(
                        catchError(error => {
                            console.error(`Error fetching doctor ${session.doctor_id}:`, error);
                            return of(null);
                        })
                    )
                );
  
                return forkJoin(doctorObservables);
            })
        ).subscribe({
            next: (doctors) => {
                console.log('All doctor details:', doctors);
                // Store doctor details in map
                this.doctorSessions.forEach((session, index) => {
                    if (doctors[index]) {
                        this.doctorDetailsMap.set(session.doctor_id, doctors[index] as UserDetails);
                    }
                });
                this.loading = false;
            },
            error: (error) => {
                console.error('Error in appointment fetch flow:', error);
                this.error = 'Failed to load appointment details.';
                this.loading = false;
            }
        });
    }

    getDoctorDetails(sessionId: string): DoctorSessions | undefined {
        return this.doctorSessions.find(session => session.session_id === sessionId);
    }

    getDoctorInfo(sessionId: string): UserDetails | undefined {
        const session = this.getDoctorDetails(sessionId);
        return session ? this.doctorDetailsMap.get(session.doctor_id) : undefined;
    }

    cancelAppointment(slot_id: string): void {
        console.log('Attempting to delete appointment with slot_id:', slot_id);
        console.log('Current appointments:', this.bookedAppointments);
        
        if (!slot_id) {
            console.error('No slot_id provided for deletion');
            alert('Invalid appointment ID');
            return;
        }
        
        if (!confirm('Are you sure you want to delete this appointment?')) {
            return;
        }
        
        this.appointmentsService.deleteAppointment(slot_id).subscribe({
            next: () => {
                console.log('Successfully deleted appointment with slot_id:', slot_id);
                this.bookedAppointments = this.bookedAppointments.filter(app => app.slot_id !== slot_id);
                alert('Appointment deleted successfully.');
            },
            error: (err) => {
                console.error('Error deleting appointment:', err);
                alert('Failed to delete appointment. Please try again.');
            }
        });
    }
}
