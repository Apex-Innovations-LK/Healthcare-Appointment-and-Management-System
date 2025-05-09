import { Component, Input, SimpleChanges } from '@angular/core';
import { CalendarSessionComponent } from '../calendar-session/calendar-session.component';
import { ButtonModule } from 'primeng/button';
import { DoctorService } from '../../../../service/doctor.service';

@Component({
    selector: 'app-calendar-col',
    imports: [ButtonModule, CalendarSessionComponent],
    templateUrl: './calendar-col.component.html',
    styleUrl: './calendar-col.component.scss'
})
export class CalendarColComponent {
    @Input() date!: Date;
    @Input() sessionData!: any[];

    @Input() calendarConfig!: {
        startTime: number;
        endTime: number;
        hourHeight: number;
        calendarLineHeight: number;
        calendarColHeight: number;
    };

    lines: number[] = Array.from({ length: 19 });


    ngOnChanges(changes: SimpleChanges): void {
        if (this.calendarConfig) {
            this.lines = Array.from({ length: this.calendarConfig.endTime - this.calendarConfig.startTime + 2 });
        }
        
    }

    isToday(): boolean {
        const today = new Date();
        return this.date.getDate() === today.getDate() && this.date.getMonth() === today.getMonth() && this.date.getFullYear() === today.getFullYear();
    }

    getNowDivTopOffset(): string {
        const nowTime = new Date();
        const nowHour = nowTime.getHours();
        const nowMinutes = nowTime.getMinutes();

        const totalMinutes = (nowHour - this.calendarConfig.startTime) * 60 + nowMinutes;
        const linesCount = nowHour - this.calendarConfig.startTime + 1;

        return `${totalMinutes + this.calendarConfig.calendarLineHeight * linesCount}px`;
    }

}
