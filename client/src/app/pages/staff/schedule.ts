import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';

@Component({
    selector: 'app-staff-schedule',
    imports: [CalendarViewComponent, ButtonModule, RippleModule, RouterModule, ButtonModule],
    standalone: true,
    template: `<div class="bg-surface-0 dark:bg-surface-900">
        <div id="home" class="landing-wrapper overflow-hidden">
            <app-calendar-view type="staff" [calendarConfig]="calendarConfig" class="w-full my-5" />
        </div>
    </div> `
})
export class Schedule {
    startTime = 6;
    endTime = 23;
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
