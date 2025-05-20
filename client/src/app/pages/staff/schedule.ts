import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { StaffScheduleViewerComponent } from './components/staffSchedularView';


@Component({
    selector: 'app-staff-schedule',
    standalone: true,
    imports: [StaffScheduleViewerComponent, ButtonModule, RippleModule, RouterModule, CardModule, CommonModule],
    template: `
        <div class="bg-surface-0 dark:bg-surface-900 p-4">
            <div class="flex flex-col gap-4 max-w-screen-2xl mx-auto">
                <!-- Header Section -->
                <div class="flex flex-wrap justify-center items-center gap-3">
                    <h1 class="text-2xl font-bold m-0">Staff Schedule</h1>
                    <p class="text-gray-500 dark:text-gray-400 mt-1">View your weekly schedule</p>
                </div>

                <!-- Calendar View -->
                <app-staff-schedule-viewer></app-staff-schedule-viewer>
            </div>
        </div>
    `
})
export class Schedule {
    // Calendar configuration
    startTime = 6; // 6 AM
    endTime = 23; // 11 PM
    hourHeight = 60;
    calendarLineHeight = 2;
    calendarColHeight = (this.endTime - this.startTime + 1) * this.hourHeight + this.calendarLineHeight * (this.endTime - this.startTime + 2);

    calendarConfig = {
        startTime: this.startTime,
        endTime: this.endTime,
        hourHeight: this.hourHeight,
        calendarLineHeight: this.calendarLineHeight,
        calendarColHeight: this.calendarColHeight
    };
}
