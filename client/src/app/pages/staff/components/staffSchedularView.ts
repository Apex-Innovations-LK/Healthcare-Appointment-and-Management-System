import { Component, OnInit } from '@angular/core';
import { Schedule } from '../../../models/schedule';
import { SchedularService } from '../../../service/schedular.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../../service/auth-state.service';
import { AuthService } from '../../../service/auth.service';
import { Doctor } from '../../../models/doctor';

@Component({
    selector: 'app-staff-schedule-viewer',
    standalone: true,
    imports: [CommonModule, DatePipe],
    providers: [DatePipe],
    template: `
        <div class="p-6 max-w-6xl mx-auto">
            <h1 class="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Staff Schedule Calendar</h1>

            <div *ngIf="loading" class="flex justify-center items-center h-64">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
            </div>

            <div *ngIf="error" class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
                {{ error }}
            </div>

            <!-- Calendar View -->
            <div *ngIf="!loading && !error" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <!-- Calendar Header -->
                <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <div class="flex space-x-4">
                        <button
                            (click)="previousWeek()"
                            class="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-200 transition duration-150 ease-in-out border border-gray-300 dark:border-gray-600"
                        >
                            <span class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous
                            </span>
                        </button>
                        <button
                            (click)="nextWeek()"
                            class="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-200 transition duration-150 ease-in-out border border-gray-300 dark:border-gray-600"
                        >
                            <span class="flex items-center">
                                Next
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </button>
                    </div>
                    <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">{{ startDate | date: 'MMM d' }} - {{ endDate | date: 'MMM d, y' }}</h2>
                </div>

                <!-- Calendar Grid -->
                <div class="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <div *ngFor="let day of weekDays" class="p-2 text-center font-medium border-r last:border-r-0 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                        {{ day }}
                    </div>
                </div>

                <!-- Calendar Body -->
                <div class="grid grid-cols-7 h-96">
                    <div *ngFor="let date of currentWeekDates" class="border-r last:border-r-0 border-gray-200 dark:border-gray-700 relative bg-white dark:bg-gray-800">
                        <div class="p-1 text-right text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                            {{ date | date: 'd' }}
                        </div>

                        <!-- Appointments for this day -->
                        <div class="overflow-y-auto h-full pb-2">
                            <div
                                *ngFor="let appointment of getAppointmentsForDay(date)"
                                class="mx-1 my-1 p-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm shadow hover:shadow-md transition-shadow duration-150 cursor-pointer border border-blue-200 dark:border-blue-800"
                                (click)="onMouseEnter(appointment)"
                                (mouseleave)="onMouseLeave()"
                            >
                                <div class="font-semibold">{{ appointment.from | date: 'h:mm a' }} - {{ appointment.to | date: 'h:mm a' }}</div>
                                <div class="text-xs text-gray-700 dark:text-gray-300 truncate">DR. {{ appointment.doctor_id | slice: 0 : 8 }}...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Center Popup Box -->
        <div *ngIf="showPopup && hoveredAppointment" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full relative border border-gray-200 dark:border-gray-700">
                <button (click)="onMouseLeave()" class="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-xl transition duration-150 ease-in-out">&times;</button>
                <h3 class="text-lg font-bold mb-2 text-gray-800 dark:text-gray-100">Schedule Details</h3>
                <div class="space-y-2 text-gray-700 dark:text-gray-300">
                    <p><strong class="text-gray-900 dark:text-gray-100">Doctor:</strong> {{ hoveredAppointment.doctor_id }}</p>
                    <p><strong class="text-gray-900 dark:text-gray-100">Time:</strong> {{ hoveredAppointment.from | date: 'shortTime' }} - {{ hoveredAppointment.to | date: 'shortTime' }}</p>
                    <p><strong class="text-gray-900 dark:text-gray-100">Date:</strong> {{ hoveredAppointment.from | date: 'fullDate' }}</p>
                </div>
            </div>
        </div>
    `,
    styles: []
})
export class StaffScheduleViewerComponent implements OnInit {
    schedules: Schedule[] = [];
    loading: boolean = true;
    error: string = '';
    staffId: string = '';

    currentDate: Date = new Date();
    startDate: Date = new Date();
    endDate: Date = new Date();
    currentWeekDates: Date[] = [];
    weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Hover state
    hoveredAppointment: Schedule | null = null;
    showPopup: boolean = false;

    constructor(
        private scheduleService: SchedularService,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private authStateService: AuthStateService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.staffId = this.authStateService.getUserDetails()?.id || '';
        this.setCalendarDates();
        this.loadSchedules();
    }

    loadSchedules(): void {
        this.loading = true;
        this.scheduleService.getSchedule(this.staffId).subscribe({
            next: (data) => {
                this.schedules = data.map((schedule) => ({
                    ...schedule,
                    from: new Date(schedule.from),
                    to: new Date(schedule.to)
                }));
                this.loading = false;

                this.authService.getDoctors().subscribe({
                    next: (response: Doctor[]) => {
                        this.schedules = this.schedules.map((session) => {
                            const doctor = response.find((doc) => doc.doctor_id === session.doctor_id);
                            if (doctor) {
                                session.doctor_id = `${doctor.first_name} ${doctor.last_name}`;
                            }
                            return session;
                        });
                    }
                });
            },
            error: (err) => {
                this.error = 'Failed to load schedule data. Please try again later.';
                this.loading = false;
                console.error('Error loading schedules:', err);
            }
        });
    }

    setCalendarDates(): void {
        const startOfWeek = new Date(this.currentDate);
        startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());
        this.startDate = new Date(startOfWeek);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        this.endDate = new Date(endOfWeek);

        this.currentWeekDates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            this.currentWeekDates.push(date);
        }
    }

    getAppointmentsForDay(day: Date): Schedule[] {
        return this.schedules.filter((schedule) => {
            const scheduleDate = new Date(schedule.from);
            return scheduleDate.getDate() === day.getDate() && scheduleDate.getMonth() === day.getMonth() && scheduleDate.getFullYear() === day.getFullYear();
        });
    }

    previousWeek(): void {
        this.currentDate.setDate(this.currentDate.getDate() - 7);
        this.setCalendarDates();
    }

    nextWeek(): void {
        this.currentDate.setDate(this.currentDate.getDate() + 7);
        this.setCalendarDates();
    }

    onMouseEnter(appointment: Schedule): void {
        this.hoveredAppointment = appointment;
        this.showPopup = true;
    }

    onMouseLeave(): void {
        this.hoveredAppointment = null;
        this.showPopup = false;
    }
}
