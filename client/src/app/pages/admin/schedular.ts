import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchedularService } from '../../service/schedular.service';
import { AuthService } from '../../service/auth.service';
import { AuthStateService } from '../../service/auth-state.service';
import { Subscription, interval } from 'rxjs';

interface ScheduleStats {
    lastRun: string;
    nextScheduledRun: string;
    doctorsScheduled: number;
    staffScheduled: number;
    status: 'idle' | 'running' | 'completed' | 'failed';
}

interface ScheduleHistory {
    id: number;
    runDate: string;
    startTime: string;
    endTime: string;
    doctorsScheduled: number;
    staffScheduled: number;
    status: 'completed' | 'failed';
    runBy: string;
}

@Component({
    selector: 'app-admin-schedular',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="p-6">
            <!-- Header with page title -->
            <div class="mb-6">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Staff Scheduler</h1>
                <p class="text-gray-500 dark:text-gray-400">Schedule staff according to doctor availability</p>
            </div>

            <!-- Main action card -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-8">
                <div class="p-6">
                    <div class="flex flex-col lg:flex-row lg:items-center">
                        <div class="flex-grow">
                            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Schedule Generation</h2>
                            <p class="mt-1 text-gray-500 dark:text-gray-400">Run the scheduling algorithm to automatically assign staff based on doctor availability.</p>

                            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Last run</p>
                                    <p class="mt-1 text-gray-900 dark:text-white">
                                        {{ scheduleStats.lastRun || 'Never' }}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                                    <div class="mt-1">
                                        <span
                                            [ngClass]="{
                                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300': scheduleStats.status === 'idle',
                                                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': scheduleStats.status === 'running',
                                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': scheduleStats.status === 'completed',
                                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': scheduleStats.status === 'failed'
                                            }"
                                            class="px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full"
                                        >
                                            {{ getStatusText() }}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Doctors scheduled</p>
                                    <p class="mt-1 text-gray-900 dark:text-white">
                                        {{ scheduleStats.doctorsScheduled || 0 }}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Staff scheduled</p>
                                    <p class="mt-1 text-gray-900 dark:text-white">
                                        {{ scheduleStats.staffScheduled || 0 }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 lg:mt-0 lg:ml-6 flex-shrink-0">
                            <button
                                (click)="runScheduler()"
                                class="w-full lg:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                [disabled]="scheduleStats.status === 'running'"
                            >
                                <svg *ngIf="scheduleStats.status === 'running'" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {{ scheduleStats.status === 'running' ? 'Running...' : 'Run Scheduler' }}
                            </button>
                            <p *ngIf="scheduleStats.status === 'running'" class="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">This might take a few minutes</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Information cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div class="ml-4">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Schedule Period</h3>
                            <p class="text-gray-500 dark:text-gray-400">{{ getSchedulePeriod() }}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div class="ml-4">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Available Doctors</h3>
                            <p class="text-gray-500 dark:text-gray-400">{{ availableDoctors }}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <div class="ml-4">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Available Staff</h3>
                            <p class="text-gray-500 dark:text-gray-400">{{ availableStaff }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Previous runs history -->
            <div>
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">Scheduling History</h2>
                </div>

                <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead class="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Run Date</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Doctors</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Staff</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Run By</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                <tr *ngFor="let history of scheduleHistory" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {{ history.runDate }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ history.startTime }} - {{ history.endTime }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {{ history.doctorsScheduled }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {{ history.staffScheduled }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span
                                            [ngClass]="{
                                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': history.status === 'completed',
                                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': history.status === 'failed'
                                            }"
                                            class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                                        >
                                            {{ history.status.charAt(0).toUpperCase() + history.status.slice(1) }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {{ history.runBy }}
                                    </td>
                                </tr>
                                <tr *ngIf="scheduleHistory.length === 0">
                                    <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">No scheduling history found</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Schedular implements OnInit, OnDestroy {
    availableDoctors: number = 0;
    availableStaff: number = 0;
    scheduleStats: ScheduleStats = {
        lastRun: '',
        nextScheduledRun: '',
        doctorsScheduled: 0,
        staffScheduled: 0,
        status: 'idle'
    };

    scheduleHistory: ScheduleHistory[] = [];
    private runningStartTime: Date | null = null;
    private subscription: Subscription | null = null;
    private weeklyCheckSubscription: Subscription | null = null;

    constructor(
        private http: HttpClient,
        private schedularService: SchedularService,
        private authService: AuthService,
        private authStateService: AuthStateService
    ) {}

    ngOnInit(): void {
        // Load all data initially
        this.loadDashboardData();

        // Set up weekly check to update schedule period every Sunday
        this.checkAndUpdateWeeklySchedule();
        this.setupWeeklyCheck();

        // Load saved history from localStorage
        this.loadSavedHistory();
    }

    ngOnDestroy(): void {
        // Clean up subscriptions to prevent memory leaks
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        if (this.weeklyCheckSubscription) {
            this.weeklyCheckSubscription.unsubscribe();
        }
    }

    /**
     * Sets up a daily check to see if it's Sunday and we need to update the schedule period
     */
    setupWeeklyCheck(): void {
        // Check every day at midnight
        this.weeklyCheckSubscription = interval(24 * 60 * 60 * 1000).subscribe(() => {
            this.checkAndUpdateWeeklySchedule();
        });
    }

    /**
     * Checks if today is Sunday and updates the schedule period if needed
     */
    checkAndUpdateWeeklySchedule(): void {
        const today = new Date();
        // If today is Sunday (0), update the schedule period
        if (today.getDay() === 0) {
            // Update the schedule period
            this.getSchedulePeriod();
            // Also refresh dashboard data
            this.loadDashboardData();
        }
    }

    /**
     * Loads dashboard data, including counts and history
     */
    loadDashboardData(): void {
        this.loadScheduleStats();
        this.loadCountData();
    }

    /**
     * Loads schedule statistics, possibly from backend
     */
    loadScheduleStats(): void {
        // In a real implementation, this would fetch from API
        // For now, we'll load from localStorage if available
        const savedStats = localStorage.getItem('scheduleStats');
        if (savedStats) {
            this.scheduleStats = JSON.parse(savedStats);
        }
    }

    /**
     * Loads count data for doctors and staff
     */
    loadCountData(): void {
        this.authService.getCount().subscribe((response: any) => {
            console.log(response);
            this.availableDoctors = response.DoctorsAvailable;
            this.availableStaff = response.StaffsAvailable;
        });
    }

    /**
     * Loads schedule history from localStorage
     */
    loadSavedHistory(): void {
        const savedHistory = localStorage.getItem('scheduleHistory');
        if (savedHistory) {
            this.scheduleHistory = JSON.parse(savedHistory);
            // Sort history by most recent first
            this.scheduleHistory.sort((a, b) => {
                const dateA = new Date(`${a.runDate} ${a.startTime}`).getTime();
                const dateB = new Date(`${b.runDate} ${b.startTime}`).getTime();
                return dateB - dateA;
            });
        }
    }

    /**
     * Saves schedule history to localStorage
     */
    saveHistory(): void {
        localStorage.setItem('scheduleHistory', JSON.stringify(this.scheduleHistory));
    }

    /**
     * Saves schedule stats to localStorage
     */
    saveScheduleStats(): void {
        localStorage.setItem('scheduleStats', JSON.stringify(this.scheduleStats));
    }

    /**
     * Runs the scheduler with accurate time tracking
     */
    runScheduler(): void {
        if (this.scheduleStats.status === 'running') return;

        // Store the exact start time
        this.runningStartTime = new Date();
        const formattedDate = this.runningStartTime.toISOString().split('T')[0];
        const startTime = this.runningStartTime.toTimeString().split(' ')[0].substring(0, 8);

        // Update state to running
        this.scheduleStats.status = 'running';
        this.saveScheduleStats();

        this.schedularService.runSchedular().subscribe(
            (data) => {
                console.log(data);

                // Calculate the exact end time
                const endDate = new Date();
                const endTime = endDate.toTimeString().split(' ')[0].substring(0, 8);

                // Get the actual counts
                this.schedularService.getCount().subscribe(
                    (response: any) => {
                        console.log(response);

                        // Update stats with real data
                        this.scheduleStats = {
                            lastRun: `${formattedDate} ${startTime}`,
                            nextScheduledRun: this.getNextSundayString(),
                            doctorsScheduled: response.doctorCount,
                            staffScheduled: response.staffCount,
                            status: 'completed'
                        };

                        // Save stats to persist between refreshes
                        this.saveScheduleStats();

                        // Add to history with accurate timing
                        this.scheduleHistory.unshift({
                            id: this.getNextHistoryId(),
                            runDate: formattedDate,
                            startTime: startTime,
                            endTime: endTime,
                            doctorsScheduled: response.doctorCount,
                            staffScheduled: response.staffCount,
                            status: 'completed',
                            runBy: this.authStateService.getUserDetails()?.first_name || 'System'
                        });

                        // Save history to persist between refreshes
                        this.saveHistory();

                        console.log(this.scheduleHistory);
                    },
                    (error) => {
                        console.error('Error getting counts:', error);
                        this.handleScheduleError(formattedDate, startTime, endDate);
                    }
                );
            },
            (error) => {
                console.error('Error running scheduler:', error);
                const endDate = new Date();
                this.handleScheduleError(formattedDate, startTime, endDate);
            }
        );
    }

    /**
     * Handles errors when running the scheduler
     */
    private handleScheduleError(formattedDate: string, startTime: string, endDate: Date): void {
        const endTime = endDate.toTimeString().split(' ')[0].substring(0, 8);

        // Update stats for failure
        this.scheduleStats.status = 'failed';
        this.scheduleStats.lastRun = `${formattedDate} ${startTime}`;
        this.saveScheduleStats();

        // Add failure to history
        this.scheduleHistory.unshift({
            id: this.getNextHistoryId(),
            runDate: formattedDate,
            startTime: startTime,
            endTime: endTime,
            doctorsScheduled: 0,
            staffScheduled: 0,
            status: 'failed',
            runBy: this.authStateService.getUserDetails()?.first_name || 'System'
        });

        this.saveHistory();
    }

    /**
     * Gets the next history ID (to ensure unique IDs)
     */
    private getNextHistoryId(): number {
        if (this.scheduleHistory.length === 0) return 1;

        // Find the highest ID and add 1
        const maxId = Math.max(...this.scheduleHistory.map((h) => h.id));
        return maxId + 1;
    }

    /**
     * Gets formatted string for the next Sunday
     */
    private getNextSundayString(): string {
        const today = new Date();
        const nextSunday = new Date(today);
        const daysUntilNextSunday = (7 - today.getDay()) % 7;
        nextSunday.setDate(today.getDate() + daysUntilNextSunday);

        return `${nextSunday.toISOString().split('T')[0]} 00:00:00`;
    }

    /**
     * Gets text representation of current status
     */
    getStatusText(): string {
        switch (this.scheduleStats.status) {
            case 'idle':
                return 'Ready to Run';
            case 'running':
                return 'Running';
            case 'completed':
                return 'Completed';
            case 'failed':
                return 'Failed';
            default:
                return 'Unknown';
        }
    }

    /**
     * Gets the schedule period (Sunday to Sunday)
     */
    getSchedulePeriod(): string {
        const today = new Date();

        // Find current Sunday (beginning of the week)
        const currentSunday = new Date(today);
        const diff = today.getDay();
        currentSunday.setDate(today.getDate() - diff);

        // Find next Sunday (end of the week)
        const nextSunday = new Date(currentSunday);
        nextSunday.setDate(currentSunday.getDate() + 7);

        const formatDate = (date: Date): string => {
            return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
        };

        return `${formatDate(currentSunday)} - ${formatDate(nextSunday)}`;
    }
}
