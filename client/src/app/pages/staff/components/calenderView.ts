import { Component, Input, OnInit } from '@angular/core';
import { CalendarColComponent } from './calenderColumn';
import { DialogModule } from 'primeng/dialog';
import { DatePipe, CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { SchedularService } from '../../../service/schedular.service';
import { AuthStateService } from '../../../service/auth-state.service';
import { Schedule } from '../../../models/schedule';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-calendar-view',
    standalone: true,
    imports: [DialogModule, DatePipe, ButtonModule, InputTextModule, ReactiveFormsModule, CalendarColComponent, CommonModule, DropdownModule, TooltipModule],
    template: `
        <div class="flex flex-col w-full p-4">
            <!-- Calendar Controls -->
            <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
                <div class="flex items-center gap-2">
                    <button pButton icon="pi pi-arrow-left" class="p-button-outlined p-button-rounded" (click)="previousWeek()"></button>
                    <h2 class="text-xl font-semibold m-0">{{ weekDates[0] | date: 'MMM d' }} - {{ weekDates[6] | date: 'MMM d, yyyy' }}</h2>
                    <button pButton icon="pi pi-arrow-right" class="p-button-outlined p-button-rounded" (click)="nextWeek()"></button>
                    <button pButton label="Today" class="p-button-text ml-2" (click)="goToToday()"></button>
                </div>
                <div class="flex items-center gap-2">
                    <button pButton label="Refresh Data" icon="pi pi-refresh" class="p-button-outlined" (click)="loadData()"></button>
                </div>
            </div>

            <!-- Calendar Grid -->
            <div class="flex flex-col w-full overflow-x-auto shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
                <!-- Header Row -->
                <div class="flex sticky top-0 z-10 bg-white dark:bg-gray-800">
                    <div class="w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"></div>
                    @for (date of weekDates; track $index) {
                        <div
                            class="day-header flex-1 flex flex-col items-center py-4 border-r border-gray-200 dark:border-gray-700
                               {{ isToday(date) ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800' }}"
                        >
                            <p class="text-lg font-medium m-0">{{ date | date: 'EEE' }}</p>
                            <p class="text-sm m-0 {{ isToday(date) ? 'text-blue-600 dark:text-blue-400 font-bold' : '' }}">
                                {{ date | date: 'MMM d' }}
                            </p>
                        </div>
                    }
                </div>

                <!-- Calendar Body -->
                <div class="calendar-body flex relative">
                    <!-- Time Labels Column -->
                    <div class="time-labels w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                        <div class="flex flex-col items-end justify-between py-1 pr-2" [style.height]="calendarConfig.calendarColHeight + 'px'">
                            @for (time of timeLabels; track $index) {
                                <div class="text-xs text-gray-500 dark:text-gray-400 -mt-2">{{ time }}</div>
                            }
                        </div>
                    </div>

                    <!-- Day Columns -->
                    <div class="flex flex-1">
                        @if (weekDates.length > 0) {
                            @for (date of weekDates; track $index) {
                                <app-calendar-col [date]="date" [calendarConfig]="calendarConfig" [sessionData]="getSessionsForDate(date)" class="flex flex-1" />
                            }
                        }
                    </div>
                </div>
            </div>

            <!-- Debug Info -->
            @if (showDebugInfo) {
                <div class="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold mb-2">Debug Information</h3>
                    <p>Total sessions loaded: {{ allSessions.length }}</p>
                    <button pButton label="Toggle Raw Data" class="p-button-sm mt-2" (click)="toggleRawData()"></button>

                    @if (showRawData) {
                        <div class="mt-2 bg-white dark:bg-gray-900 p-2 rounded overflow-auto max-h-60">
                            <pre class="text-xs">{{ allSessions | json }}</pre>
                        </div>
                    }
                </div>
            }

            <!-- Error Message -->
            @if (error) {
                <div class="p-4 mt-4 bg-red-100 text-red-700 rounded-lg border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700">
                    {{ error }}
                </div>
            }
        </div>
    `
})
export class CalendarViewComponent implements OnInit {
    weekDates: Date[] = [];
    allSessions: Schedule[] = [];
    error: string | null = null;
    showDebugInfo: boolean = true; // Set to false in production
    showRawData: boolean = false;

    @Input() calendarConfig = {
        startTime: 6, // Start at 6 AM
        endTime: 20, // End at 8 PM
        hourHeight: 60, // Height of one hour in pixels
        calendarLineHeight: 1, // Height of grid line
        calendarColHeight: 840 // Total height of column (60px * 14 hours)
    };

    @Input() type!: 'schedule' | 'plan' | 'staff';

    constructor(
        private schedularService: SchedularService,
        private authStateService: AuthStateService
    ) {}

    ngOnInit() {
        this.generateCurrentWeek();
        this.loadData();
    }

    loadData(): void {
        const staff_id = this.authStateService.getUserDetails()?.id || '';

        if (!staff_id) {
            this.error = 'User ID not found. Please log in again.';
            return;
        }

        this.schedularService.getSchedule(staff_id).subscribe({
            next: (response: Schedule[]) => {
                this.allSessions = response;
                this.processSessionDates();
                this.error = null;
            },
            error: (err) => {
                console.error('Failed to load schedule:', err);
                this.error = 'Failed to load schedule. Please try again later.';
            }
        });
    }

    // Process dates to ensure they are proper Date objects
    processSessionDates(): void {
        this.allSessions = this.allSessions.map((session) => {
            // Only convert valid date strings, leave existing Date objects as is
            if (session.from && typeof session.from === 'string') {
                session.from = new Date(session.from);
            }
            if (session.to && typeof session.to === 'string') {
                session.to = new Date(session.to);
            }
            return session;
        });
    }

    // Get sessions for a specific date
    getSessionsForDate(date: Date): Schedule[] {
        return this.allSessions.filter((session) => {
            if (!session.from) return false;

            const sessionDate = new Date(session.from);
            return this.isSameDay(sessionDate, date);
        });
    }

    isSameDay(date1: Date | string, date2: Date | string): boolean {
        const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
        const d2 = typeof date2 === 'string' ? new Date(date2) : date2;

        return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    }

    generateCurrentWeek(baseDate: Date = new Date()) {
        // Get the day index (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const dayOfWeek = baseDate.getDay();

        // Calculate difference to Monday
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // handle Sunday (0) as -6

        // Get this week's Monday
        const monday = new Date(baseDate);
        monday.setDate(baseDate.getDate() + diffToMonday);
        monday.setHours(0, 0, 0, 0); // reset to midnight

        // Create list of 7 days
        this.weekDates = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            return date;
        });
    }

    isToday(date: Date): boolean {
        const today = new Date();
        return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    }

    previousWeek(): void {
        const previousMonday = new Date(this.weekDates[0]);
        previousMonday.setDate(previousMonday.getDate() - 7);
        this.generateCurrentWeek(previousMonday);
    }

    nextWeek(): void {
        const nextMonday = new Date(this.weekDates[0]);
        nextMonday.setDate(nextMonday.getDate() + 7);
        this.generateCurrentWeek(nextMonday);
    }

    goToToday(): void {
        this.generateCurrentWeek();
    }

    toggleRawData(): void {
        this.showRawData = !this.showRawData;
    }

    get timeLabels(): string[] {
        return Array.from({ length: this.calendarConfig.endTime - this.calendarConfig.startTime + 1 }, (_, i) => {
            const hour = this.calendarConfig.startTime + i;
            const label = hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
            return label;
        });
    }
}
