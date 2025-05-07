import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
<<<<<<< HEAD
import { CalendarViewComponent } from './components/calenderView';

@Component({
    selector: 'app-doctor-schedule',
    imports: [CalendarViewComponent, ButtonModule, RippleModule, RouterModule, ButtonModule,],
    standalone: true,
    template: `<div class="bg-surface-0 dark:bg-surface-900">
        <div id="home" class="landing-wrapper overflow-hidden">
        <app-calendar-view type='plan' [calendarConfig]="calendarConfig" class="w-full my-5" />
=======
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';

@Component({
    selector: 'app-staff-schedule',
    imports: [CalendarViewComponent, ButtonModule, RippleModule, RouterModule, ButtonModule],
    standalone: true,
    template: `<div class="bg-surface-0 dark:bg-surface-900">
        <div id="home" class="landing-wrapper overflow-hidden">
            <app-calendar-view type="staff" [calendarConfig]="calendarConfig" class="w-full my-5" />
>>>>>>> c6fa563fbd688936b76394b7f2e3ba54b5e58e80
        </div>
    </div> `
})
export class Schedule {
    startTime = 6;
    endTime = 23;
    hourHeight = 60;
    calendarLineHeight = 2;
<<<<<<< HEAD
    calendarColHeight = (this.endTime - this.startTime + 1) * this.hourHeight + this.calendarLineHeight*(this.endTime - this.startTime + 2); 
=======
    calendarColHeight = (this.endTime - this.startTime + 1) * this.hourHeight + this.calendarLineHeight * (this.endTime - this.startTime + 2);
>>>>>>> c6fa563fbd688936b76394b7f2e3ba54b5e58e80

    calendarConfig = {
        startTime: this.startTime,
        endTime: this.endTime,
        hourHeight: this.hourHeight,
        calendarLineHeight: this.calendarLineHeight,
        calendarColHeight: this.calendarColHeight
    };
}
