import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { CalendarSessionComponent } from './calenderSession';
import { Schedule } from '../../../models/schedule';

@Component({
    selector: 'app-calendar-col',
    standalone: true,
    imports: [CommonModule, CalendarSessionComponent],
    template: `
        <div
            class="calendar-col flex-1 relative border-r border-gray-200 dark:border-gray-700 
            {{ isToday ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800' }}"
        >
            <!-- Hour grid lines -->
            <div class="grid-lines absolute top-0 left-0 w-full h-full">
                @for (hour of hours; track $index) {
                    <div class="hour-line w-full border-t border-gray-200 dark:border-gray-700" [style.height]="calendarConfig.hourHeight + 'px'"></div>
                }
            </div>

            <!-- Sessions -->
            @for (session of filteredSessions; track $index) {
                <app-calendar-session [calendarConfig]="calendarConfig" [sessionData]="session"></app-calendar-session>
            }

            <!-- Current time indicator -->
            @if (isToday && showCurrentTimeIndicator) {
                <div class="current-time-indicator absolute w-full border-t-2 border-red-500 z-30" [style.top]="currentTimePosition + 'px'">
                    <div class="h-2 w-2 rounded-full bg-red-500 -mt-1 -ml-1"></div>
                </div>
            }
        </div>
    `
})
export class CalendarColComponent implements OnInit {
    @Input() date!: Date;
    @Input() calendarConfig!: {
        startTime: number;
        endTime: number;
        hourHeight: number;
        calendarLineHeight: number;
        calendarColHeight: number;
    };
    @Input() sessionData: Schedule[] = [];

    hours: number[] = [];
    isToday = false;
    showCurrentTimeIndicator = false;
    currentTimePosition = 0;
    filteredSessions: Schedule[] = [];

    ngOnInit(): void {
        this.setupHours();
        this.checkIfToday();
        this.updateCurrentTimePosition();
        this.filterSessionsForDate();

        // Update time indicator every minute
        if (this.isToday) {
            setInterval(() => this.updateCurrentTimePosition(), 60000);
        }
    }

    setupHours(): void {
        this.hours = Array.from({ length: this.calendarConfig.endTime - this.calendarConfig.startTime + 1 }, (_, i) => this.calendarConfig.startTime + i);
    }

    checkIfToday(): void {
        const today = new Date();
        this.isToday = this.date.getDate() === today.getDate() && this.date.getMonth() === today.getMonth() && this.date.getFullYear() === today.getFullYear();
    }

    updateCurrentTimePosition(): void {
        if (!this.isToday) return;

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        if (hours < this.calendarConfig.startTime || hours > this.calendarConfig.endTime) {
            this.showCurrentTimeIndicator = false;
            return;
        }

        this.showCurrentTimeIndicator = true;

        // Calculate position based on hours and minutes
        const hourPosition = (hours - this.calendarConfig.startTime) * this.calendarConfig.hourHeight;
        const minutePosition = (minutes / 60) * this.calendarConfig.hourHeight;

        // Add additional height for grid lines
        const gridLineOffset = (hours - this.calendarConfig.startTime + 1) * this.calendarConfig.calendarLineHeight;

        this.currentTimePosition = hourPosition + minutePosition + gridLineOffset;
    }

    filterSessionsForDate(): void {
        if (!this.sessionData || !this.sessionData.length) {
            this.filteredSessions = [];
            return;
        }

        // Filter sessions for the current date column
        this.filteredSessions = this.sessionData.filter((session) => {
            if (!session.from && !session.to) return false;

            const sessionDate = new Date(session.from || session.to);
            return this.isSameDay(sessionDate, this.date);
        });
    }

    isSameDay(date1: Date, date2: Date): boolean {
        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    }
}
