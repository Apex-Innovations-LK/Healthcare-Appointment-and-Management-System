import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';

@Component({
    selector: 'app-calendar-session',
    imports: [DatePipe, ButtonModule, ChipModule],
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
        slots: boolean[];
    };

    @ViewChild('componentRef2') componentRef!: ElementRef;

    fromTime!: Date;
    toTime!: Date;
    appointments: any[] = [];
    height!:string;
    items: MenuItem[] = [];
    expanded = false;

    ngOnChanges(changes: SimpleChanges): void {
        if (this.session) {
            this.fromTime = new Date(this.session.from);
            this.toTime = new Date(this.session.to);
            this.setHeight();
        }
        this.items = [{ label: 'Update', icon: 'pi pi-refresh' }, { label: 'Delete', icon: 'pi pi-times' }, { label: 'Angular.io', icon: 'pi pi-info', url: 'http://angular.io' }, { separator: true }, { label: 'Setup', icon: 'pi pi-cog' }];
    }

    getTopOffset(): string {
        const fromHour = this.fromTime.getHours();
        const fromMinutes = this.fromTime.getMinutes();

        const totalMinutes = (fromHour - this.calendarConfig.startTime) * 60 + fromMinutes;
        const linesCount = fromHour - this.calendarConfig.startTime + 1;

        return `${totalMinutes + this.calendarConfig.calendarLineHeight * linesCount}px`;
    }

    setHeight(): void {
        const diffMinutes = Math.floor((this.toTime.getTime() - this.fromTime.getTime()) / (1000 * 60));
        const height = Math.floor(diffMinutes / 60) * this.calendarConfig.calendarLineHeight + diffMinutes;
        this.height = `${height}px`;
    }

    onMouseEnter(event: MouseEvent): void {
        this.expanded = true;
        this.height='auto';
    }

    onMouseLeave(event: MouseEvent): void {
        this.setHeight();
        this.expanded = false;
    }

    getBookedCount(): number {
        let count = 0;
        for (let i = 0; i < this.session.slots.length; i++) {
            if (this.session.slots[i] === true) {
                count++;
            }
        }
        return count;
    }

    isExpired(): boolean {
        const currentDate = new Date();
        const sessionDate = new Date(this.session.to);
        return sessionDate < currentDate;
    }
}
