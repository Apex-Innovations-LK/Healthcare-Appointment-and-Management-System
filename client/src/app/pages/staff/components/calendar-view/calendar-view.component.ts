import { Component, Input } from '@angular/core';
import { CalendarColComponent } from '../calendar-col/calendar-col.component';
import { DialogModule } from 'primeng/dialog';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {  ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-calendar-view',
    imports: [DialogModule, DatePipe, ButtonModule, InputTextModule, ReactiveFormsModule, CalendarColComponent],
    templateUrl: './calendar-view.component.html',
    styleUrl: './calendar-view.component.scss'
})
export class CalendarViewComponent {
    weekDates: Date[] = [];
    
    sessionData: any[] = [];

    @Input() calendarConfig!: {
        startTime: number;
        endTime: number;
        hourHeight: number;
        calendarLineHeight: number;
        calendarColHeight: number;
    };

    @Input() type!: 'schedule' | 'plan' | 'staff';

    ngOnInit() {
        this.generateCurrentWeek();
    }

    loadData(): void {
      // this.sessionData = this.groupByDayOfWeek(response);
    }

    groupByDayOfWeek(data: [any, string][]): [any, string][][] {
        const result: [any, string][][] = Array.from({ length: 7 }, () => []);

        for (const item of data) {
            const timestamp = item[1];
            const date = new Date(timestamp);

            // Adjust to local day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
            const dayOfWeek = date.getDay();

            result[dayOfWeek].push(item);
        }

        return result;
    }

    generateCurrentWeek() {
        const today = new Date();

        // Get the day index (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const dayOfWeek = today.getDay();

        // Calculate difference to Monday
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // handle Sunday (0) as -6

        // Get this week's Monday
        const monday = new Date(today);
        monday.setDate(today.getDate() + diffToMonday);
        monday.setHours(0, 0, 0, 0); // reset to midnight

        // Create list of 7 days
        this.weekDates = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            return date;
        });
    }

    get timeLabels(): string[] {
        return Array.from({ length: this.calendarConfig.endTime - this.calendarConfig.startTime }, (_, i) => {
            const hour = this.calendarConfig.startTime + i + 1;
            const label = hour == 24 ? '12 AM -' : hour == 12 ? '12 PM -' : hour > 12 ? `${hour - 12} PM -` : `${hour} AM -`;
            return label;
        });
    }
}
