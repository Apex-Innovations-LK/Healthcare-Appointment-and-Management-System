import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppointmentsService } from '../../../service/appointment.service';
import { AuthService } from '../../../service/auth.service';
import { Appointment } from '../appointment';
import { AuthStateService } from '../../../service/auth-state.service';
import { MakeAppointment } from '../../../models/makeAppointment';

interface Doctor {
    doctor_id: string;
    first_name: string;
    last_name: string;
    speciality: string;
    license_number: string;
}

interface AppointmentSlot {
    slot_id: string;
    doctor_id: string;
    from: string;
    to: string;
}

@Component({
    selector: 'app-add-appointment',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
    template: `
        <div class="container mx-auto p-4">
            <h1 class="text-2xl font-bold mb-6 text-black dark:text-white">Make an Appointment</h1>

            <!-- Search doctor -->
            <div class="mb-6">
                <div class="flex gap-2">
                    <input type="text" [(ngModel)]="searchTerm" (input)="searchDoctors()" placeholder="Search doctors by name or speciality" class="flex-1 p-2 border rounded-md" />
                    <button (click)="searchDoctors()" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-500">Search</button>
                </div>
            </div>

            <!-- Loading state -->
            <div *ngIf="isLoading" class="flex justify-center items-center h-40">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>

            <div *ngIf="!isLoading" class="flex flex-col md:flex-row gap-6">
                <!-- Doctor list section -->
                <div class="w-full md:w-1/3">
                    <h2 class="text-xl font-semibold mb-4 text-gray-400">Select a Doctor</h2>
                    <div *ngIf="filteredDoctors.length === 0" class="text-gray-500 p-4 border rounded-md">No doctors found. Try a different search term.</div>
                    <div class="space-y-4">
                        <div
                            *ngFor="let doctor of filteredDoctors"
                            (click)="selectDoctor(doctor)"
                            class="border rounded-lg p-4 cursor-pointer transition duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                            [ngClass]="{ 'bg-blue-50 border-blue-500 shadow-md': selectedDoctorId === doctor.doctor_id }"
                        >
                            <h3 class="font-medium text-lg">Dr. {{ doctor.first_name }} {{ doctor.last_name }}</h3>
                            <p class="text-gray-400">{{ doctor.speciality }}</p>
                        </div>
                    </div>
                </div>

                <!-- Selected doctor details and availability -->
                <div class="w-full md:w-2/3" *ngIf="selectedDoctor">
                    <div class="bg-white dark:bg-gray-900 rounded-lg border p-6 mb-6">
                        <h2 class="text-xl font-semibold mb-2 text-primary">Dr. {{ selectedDoctor.first_name }} {{ selectedDoctor.last_name }}</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <p class="text-gray-600">Speciality</p>
                                <p class="font-medium">{{ selectedDoctor.speciality }}</p>
                            </div>
                            <div>
                                <p class="text-gray-600">License Number</p>
                                <p class="font-medium">{{ selectedDoctor.license_number }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Availability section -->
                    <h3 class="text-lg font-semibold mb-4 text-gray-400">Available Slots</h3>

                    <div *ngIf="doctorAppointments.length === 0" class="text-center p-6 bg-gray-50 rounded-lg dark:bg-gray-900">
                        <p class="text-gray-500">No available appointment slots for this doctor.</p>
                    </div>

                    <div class="space-y-4">
                        <div *ngFor="let appointment of doctorAppointments" class="border rounded-lg p-4">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="font-medium">{{ formatAppointmentDate(appointment.from) }}</h4>
                            </div>
                            <div
                                class="p-3 bg-green-100 text-green-800 hover:bg-green-200 rounded cursor-pointer transition duration-150"
                                [ngClass]="{ 'bg-green-500 text-white': selectedSlot && selectedSlot.slot_id === appointment.slot_id }"
                                (click)="selectSlot(appointment)"
                            >
                                {{ formatAppointmentTime(appointment.from) }} - {{ formatAppointmentTime(appointment.to) }}
                            </div>
                        </div>
                    </div>

                    <!-- Booking action buttons -->
                    <div class="flex justify-end space-x-4 mt-6">
                        <button (click)="onCancel()" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button (click)="bookAppointment()" [disabled]="!selectedSlot" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">Book Appointment</button>
                    </div>
                </div>

                <!-- No doctor selected state -->
                <div class="w-full md:w-2/3 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg p-12" *ngIf="!selectedDoctor">
                    <div class="text-center text-gray-500">
                        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            ></path>
                        </svg>
                        <p class="text-lg">Please select a doctor to view availability</p>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class AddAppointmentComponent implements OnInit {
    allDoctors: Doctor[] = [];
    filteredDoctors: Doctor[] = [];
    selectedDoctor: Doctor | null = null;
    selectedDoctorId: string | null = null;
    allAppointments: AppointmentSlot[] = [];
    doctorAppointments: AppointmentSlot[] = [];
    selectedSlot: AppointmentSlot | null = null;
    isLoading: boolean = false;
    searchTerm: string = '';

    private http = inject(HttpClient);

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private appointmentService: AppointmentsService,
        private authService: AuthService,
        private authStateService: AuthStateService // Assuming you have a service to manage authentication state
    ) {}

    ngOnInit() {
        console.log('Token in localStorage:', localStorage.getItem('token'));
        this.loadDoctors();
        this.loadAppointments();
    }

    loadDoctors() {
        this.isLoading = true;
        console.log('Loading doctors...');
        this.authService.getDoctors().subscribe({
            next: (data: any) => {
                console.log('Doctors data received:', data);
                // Parse the doctor data from the backend format
                this.allDoctors = this.parseDoctorData(data);
                this.filteredDoctors = [...this.allDoctors];
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to fetch doctors:', err);
                this.isLoading = false;
            }
        });
    }

    loadAppointments() {
        this.isLoading = true;
        this.appointmentService.getAppointments().subscribe({
            next: (data: any) => {
                // Parse the appointment data from the backend format
                this.allAppointments = this.parseAppointmentData(data);
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to fetch appointments:', err);
                this.isLoading = false;
            }
        });
    }

    parseDoctorData(data: any): Doctor[] {
        // Based on the console output format
        const doctors: Doctor[] = [];

        if (Array.isArray(data) && data.length > 0) {
            data.forEach((doc: any) => {
                doctors.push({
                    doctor_id: doc.doctor_id,
                    first_name: doc.first_name,
                    last_name: doc.last_name,
                    speciality: doc.speciality,
                    license_number: doc.license_number
                });
            });
        }
        return doctors;
    }

    parseAppointmentData(data: any): AppointmentSlot[] {
        // Based on the console output format
        const appointments: AppointmentSlot[] = [];

        if (Array.isArray(data) && data.length > 0) {
            data.forEach((item: any) => {
                if (Array.isArray(item) && item.length >= 4) {
                    appointments.push({
                        slot_id: item[0],
                        doctor_id: item[1],
                        from: item[2],
                        to: item[3]
                    });
                }
            });
        }
        return appointments;
    }

    searchDoctors() {
        if (!this.searchTerm.trim()) {
            this.filteredDoctors = [...this.allDoctors];
            return;
        }

        const term = this.searchTerm.toLowerCase();
        this.filteredDoctors = this.allDoctors.filter((doctor) => doctor.first_name.toLowerCase().includes(term) || doctor.last_name.toLowerCase().includes(term) || doctor.speciality.toLowerCase().includes(term));
    }

    selectDoctor(doctor: Doctor) {
        this.selectedDoctorId = doctor.doctor_id;
        this.selectedDoctor = doctor;
        this.selectedSlot = null;

        // Filter appointments for this doctor
        this.doctorAppointments = this.allAppointments.filter((appointment) => appointment.doctor_id === doctor.doctor_id);
    }

    selectSlot(slot: AppointmentSlot) {
        this.selectedSlot = slot;
    }

    formatAppointmentDate(dateString: string): string {
        const date = new Date(dateString);
        // Return format: Monday, May 10, 2025
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    formatAppointmentTime(dateString: string): string {
        const date = new Date(dateString);
        // Return format: 5:30 PM
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    isBooking: boolean = false;
    bookAppointment() {
        if (!this.selectedDoctor || !this.selectedSlot) {
            alert('Please select a doctor and a time slot.');
            return;
        }

        const patientId = this.authStateService.getUserDetails()?.id;
        if (!patientId) {
            alert('User not authenticated. Please log in again.');
            return;
        }

        const makeAppointment: MakeAppointment = {
            slotId: this.selectedSlot.slot_id,
            patient_id: patientId,
            appointment_type: 'General'
        };

        this.isBooking = true;
        this.appointmentService.bookAppointment(makeAppointment).subscribe({
            next: (response: string) => {
                this.isBooking = false;
                alert('Appointment booked successfully!');
                this.router.navigate(['/patient/appointments']);
            },
            error: (err) => {
                this.isBooking = false;
                console.error('Error booking appointment:', err);
                alert('Failed to book appointment. Please try again later.');
            }
        });

        this.selectedSlot = null;
    }
    

    onCancel() {
        window.history.back();
    }
}
