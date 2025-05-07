import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-calendar-availability',
    standalone: true,
    imports: [DialogModule, DatePipe, ButtonModule, InputTextModule, ReactiveFormsModule],
    template: `
        <div class="calendar-session w-[94%] p-3 flex flex-col items-center justify-evenly rounded-md absolute hover:scale-105" [style.top]="getTopOffset()" [style.height]="height" [style.overflowY]="setOverflowY()" #componentRef>
            <p class="time-duration text-lg m-0 font-bold">{{ fromTime | date: 'shortTime' }} - {{ toTime | date: 'shortTime' }}</p>
            <p class="appointments-key mt-2 text-lg w-full text-left">
                Staff ID: <span class="text-xl full-count font-semibold">{{ availability.doctorName }}</span>
            </p>
        </div>
    `
})
export class CalendarAvailabilityComponent {
    @Input() calendarConfig!: {
        startTime: number;
        endTime: number;
        hourHeight: number;
        calendarLineHeight: number;
        calendarColHeight: number;
    };

    @Input() availability!: {
        from: string;
        to: string;
        doctorName: string;
    };

    @ViewChild('componentRef') componentRef!: ElementRef;

    fromTime!: Date;
    toTime!: Date;
    height: string = '60px'; // default
    expanded = false;

    ngOnChanges(changes: SimpleChanges): void {
        if (this.availability) {
            this.fromTime = new Date(this.availability.from);
            this.toTime = new Date(this.availability.to);
            this.setHeight();
        }
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

    setOverflowY(): string {
        return this.expanded ? 'visible' : 'hidden';
    }
}
