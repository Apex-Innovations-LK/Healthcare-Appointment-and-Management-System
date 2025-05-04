import { DatePipe } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-calendar-session',
    imports: [DatePipe],
    templateUrl: './calendar-session.component.html',
    styleUrl: './calendar-session.component.scss'
})
export class CalendarSessionComponent {
    @Input() calendarConfig!: {
        startTime: number;
        endTime: number;
        hourHeight: number;
        calendarLineHeight: number;
        calendarColHeight: number;
    };

    @Input() session!: {
        from: string;
        to: string;
        patientsCount: number;
    };

    fromTime!: Date;
    toTime!: Date;
    appointments: any[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        if (this.session) {
            this.fromTime = new Date(this.session.from);
            this.toTime = new Date(this.session.to);
            this.appointments = Array.from({ length: this.session.patientsCount ?? 5 });
        }
    }

    getTopOffset(): string {
        const fromHour = this.fromTime.getHours();
        const fromMinutes = this.fromTime.getMinutes();

        const totalMinutes = (fromHour - this.calendarConfig.startTime) * 60 + fromMinutes;
        const linesCount = fromHour - this.calendarConfig.startTime + 1;

        return `${totalMinutes + this.calendarConfig.calendarLineHeight * linesCount}px`;
    }

    getHeight(): string {
        const diffMinutes = Math.floor((this.toTime.getTime() - this.fromTime.getTime()) / (1000 * 60));
        const height = Math.floor(diffMinutes / 60) * this.calendarConfig.calendarLineHeight + diffMinutes;
        return `${height}px`;
    }
}
