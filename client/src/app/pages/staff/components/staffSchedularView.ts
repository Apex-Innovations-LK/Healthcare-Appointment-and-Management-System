import { Component, OnInit } from '@angular/core';
import { Schedule } from '../../../models/schedule';
import { SchedularService } from '../../../service/schedular.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../../service/auth-state.service';

@Component({
    selector: 'app-staff-schedule-viewer',
    providers: [DatePipe],
    imports: [CommonModule, DatePipe],
    standalone: true,
    template: `
        <div class="p-6 max-w-6xl mx-auto">
            <h1 class="text-2xl font-bold mb-6">Staff Schedule Calendar</h1>

            <div *ngIf="loading" class="flex justify-center items-center h-64">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>

            <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {{ error }}
            </div>

            <!-- Calendar View -->
            <div *ngIf="!loading && !error" class="bg-white rounded-lg shadow overflow-hidden">
                <!-- Calendar Header -->
                <div class="flex items-center justify-between p-4 border-b">
                    <div class="flex space-x-4">
                        <button (click)="previousWeek()" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded">Previous Week</button>
                        <button (click)="nextWeek()" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded">Next Week</button>
                    </div>
                    <h2 class="text-lg font-semibold">{{ startDate | date: 'MMM d' }} - {{ endDate | date: 'MMM d, y' }}</h2>
                </div>

                <!-- Calendar Grid -->
                <div class="grid grid-cols-7 border-b">
                    <div *ngFor="let day of weekDays" class="p-2 text-center font-medium border-r last:border-r-0">
                        {{ day }}
                    </div>
                </div>

                <!-- Calendar Body -->
                <div class="grid grid-cols-7 h-96">
                    <div *ngFor="let date of currentWeekDates" class="border-r last:border-r-0 relative">
                        <div class="p-1 text-right text-sm text-gray-500">
                            {{ date | date: 'd' }}
                        </div>

                        <!-- Appointments for this day -->
                        <div class="overflow-y-auto h-full pb-2">
                            <div *ngFor="let appointment of getAppointmentsForDay(date)" class="mx-1 my-1 p-2 bg-blue-100 text-blue-800 rounded text-sm shadow">
                                <div class="font-semibold">{{ appointment.from | date: 'h:mm a' }} - {{ appointment.to | date: 'h:mm a' }}</div>
                                <div class="text-xs text-gray-700 truncate">Doctor ID: {{ appointment.doctor_id | slice: 0 : 8 }}...</div>
                            </div>
                        </div>
                    </div>
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

    // Calendar navigation
    currentDate: Date = new Date();
    startDate: Date = new Date();
    endDate: Date = new Date();
    currentWeekDates: Date[] = [];
    weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    constructor(
        private scheduleService: SchedularService,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private authStateService : AuthStateService
    ) {}

    ngOnInit(): void {
        // Get staff ID from route params or set a default
        this.staffId = this.authStateService.getUserDetails()?.id || '';
        console.log(this.staffId)

        this.setCalendarDates();
        this.loadSchedules();
    }

    loadSchedules(): void {
        this.loading = true;
        this.scheduleService.getSchedule(this.staffId).subscribe({
            next: (data) => {
                console.log("data", data)
                this.schedules = data.map((schedule) => ({
                    ...schedule,
                    from: new Date(schedule.from),
                    to: new Date(schedule.to)
                }));
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load schedule data. Please try again later.';
                this.loading = false;
                console.error('Error loading schedules:', err);
            }
        });
    }

    setCalendarDates(): void {
        // Calculate the start of the week (Sunday)
        const startOfWeek = new Date(this.currentDate);
        startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());
        this.startDate = new Date(startOfWeek);

        // Calculate the end of the week (Saturday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        this.endDate = new Date(endOfWeek);

        // Generate dates for the week
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
}
