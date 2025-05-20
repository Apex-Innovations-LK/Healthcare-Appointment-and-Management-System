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
    selector: 'app-view-appointment',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
    template: `
        <!-- Confirmation Modal -->
        <div *ngIf="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <!-- Background overlay -->
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <!-- Modal panel -->
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                                    Delete Appointment
                                </h3>
                                <div class="mt-2">
                                    <p class="text-sm text-gray-500">
                                        Are you sure you want to delete this appointment? This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button type="button" 
                                (click)="deleteAppointment()"
                                class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
                            Delete
                        </button>
                        <button type="button" 
                                (click)="closeDeleteModal()"
                                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="container mx-auto px-4 py-8">
            <h2 class="text-2xl font-bold mb-6 text-gray-800">My Appointments</h2>
            
            <div *ngIf="loading" class="flex justify-center items-center py-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>

            <div *ngIf="error" class="bg-red-100 border border-gray-400 text-red-700 px-4 py-3 rounded mb-4">
                {{ error }}
            </div>

            <div *ngIf="!loading && bookedAppointments.length === 0" class="text-center py-8">
                <p class="text-gray-600">No appointments found.</p>
            </div>

            <div *ngIf="!loading && bookedAppointments.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div *ngFor="let appointment of bookedAppointments" 
                     class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div class="p-6">
                        <!-- Doctor Information -->
                        <div class="mb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">
                                Dr. {{ getDoctorInfo(appointment.session_id)?.first_name }} {{ getDoctorInfo(appointment.session_id)?.last_name }}
                            </h3>
                            <p class="text-gray-600 mb-1">
                                <span class="font-medium">Speciality:</span> {{ getDoctorInfo(appointment.session_id)?.speciality || 'N/A' }}
                            </p>
                            <p class="text-gray-600">
                                <span class="font-medium">License:</span> {{ getDoctorInfo(appointment.session_id)?.license_number || 'N/A' }}
                            </p>
                        </div>

                        <!-- Appointment Details -->
                        <div class="border-t border-gray-200 pt-4">
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-sm font-medium text-gray-500">Appointment Time</span>
                                <span class="text-sm text-gray-700">
                                    {{ getDoctorDetails(appointment.session_id)?.from | date:'MMM d, y, h:mm a' }}
                                </span>
                            </div>
                            
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-sm font-medium text-gray-500">Type</span>
                                <span class="text-sm text-gray-700">{{ appointment.appointment_type }}</span>
                            </div>

                            <div class="flex justify-between items-center mb-3">
                                <span class="text-sm font-medium text-gray-500">Status</span>
                                <span [ngClass]="{
                                    'px-2 py-1 rounded-full text-xs font-medium': true,
                                    'bg-green-100 text-green-800': appointment.status === 'BOOKED',
                                    'bg-red-100 text-red-800': appointment.status === 'REJECTED'
                                }">
                                    {{ appointment.status }}
                                </span>
                            </div>

                            <div *ngIf="appointment.notes" class="mt-3">
                                <span class="text-sm font-medium text-gray-500">Notes:</span>
                                <p class="text-sm text-gray-700 mt-1">{{ appointment.notes }}</p>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="mt-4 flex justify-end">
                            <button *ngIf="appointment.status !== 'REJECTED'"
                                    (click)="openDeleteModal(appointment.slot_id)"
                                    [disabled]="isWithin24Hours(getDoctorDetails(appointment.session_id)?.from)"
                                    [class]="'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ' + 
                                            (isWithin24Hours(getDoctorDetails(appointment.session_id)?.from) ? 
                                            'bg-gray-300 cursor-not-allowed text-gray-500' : 
                                            'bg-red-500 hover:bg-red-600 text-white')"
                                    [title]="isWithin24Hours(getDoctorDetails(appointment.session_id)?.from) ? 
                                            'Cannot delete appointments within 24 hours of scheduled time' : 
                                            'Delete Appointment'">
                                Delete Appointment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        :host {
            display: block;
            min-height: 100vh;
            background-color: #f3f4f6;
        }
    `]
})

export class ViewAppointmentComponent implements OnInit {
    bookedAppointments: Appointment[] = [];
    doctorSessions: DoctorSessions[] = [];
    doctorDetailsMap: Map<string, UserDetails> = new Map();
    loading = true;
    error: string | null = null;
    showDeleteModal = false;
    appointmentToDelete: string | null = null;
  
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
                this.error = 'No appointments found.';
                this.loading = false;
            }
        });
    }

    getDoctorDetails(sessionId: string): DoctorSessions | undefined {
        return this.doctorSessions.find(session => session.slot_id === sessionId);
    }

    getDoctorInfo(sessionId: string): UserDetails | undefined {
        const session = this.getDoctorDetails(sessionId);
        return session ? this.doctorDetailsMap.get(session.doctor_id) : undefined;
    }

    openDeleteModal(slot_id: string): void {
        if (!slot_id) {
            console.error('No slot_id provided for deletion');
            alert('Invalid appointment ID');
            return;
        }
        this.appointmentToDelete = slot_id;
        this.showDeleteModal = true;
    }

    closeDeleteModal(): void {
        this.showDeleteModal = false;
        this.appointmentToDelete = null;
    }

    deleteAppointment(): void {
        if (!this.appointmentToDelete) {
            return;
        }

        this.appointmentsService.deleteAppointment(this.appointmentToDelete).subscribe({
            next: () => {
                this.bookedAppointments = this.bookedAppointments.filter(app => app.slot_id !== this.appointmentToDelete);
                this.closeDeleteModal();
                alert('Appointment deleted successfully.');
            },
            error: (err) => {
                console.error('Error deleting appointment:', err);
                alert('Failed to delete appointment. Please try again.');
            }
        });
    }

    isWithin24Hours(appointmentTime: Date | undefined): boolean {
        if (!appointmentTime) return false;
        
        const now = new Date();
        const appointmentDate = new Date(appointmentTime);
        const hoursDifference = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        return hoursDifference <= 24;
    }
}
