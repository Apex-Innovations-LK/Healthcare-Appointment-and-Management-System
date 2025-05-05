import { DatePipe } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { CalendarSessionComponent } from '../calendar-session/calendar-session.component';

@Component({
    selector: 'app-calendar-col',
    imports: [DatePipe, CalendarSessionComponent],
    templateUrl: './calendar-col.component.html',
    styleUrl: './calendar-col.component.scss'
})
export class CalendarColComponent {
    sessions: any[] = [
        {
            from: '2025-05-03T10:30:00',
            to: '2025-05-03T13:00:00',
            patientsCount: 8,
            slots: [
                true, true, true, true, true, false, false, false
            ],
        },
        {
            from: '2025-05-08T17:00:00',
            to: '2025-05-08T20:00:00',
            patientsCount: 12,
            slots: [
                true, true, true, false, false, true, false, true, true, false, false, false
            ],
        }
    ];

    @Input() date!: Date;

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
