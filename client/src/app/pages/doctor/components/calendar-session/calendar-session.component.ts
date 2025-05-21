import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DoctorSession, SessionSlot, Slot } from '../../../../models/doctor';
import { DoctorService } from '../../../../service/doctor.service';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { Router } from '@angular/router';

@Component({
    selector: 'app-calendar-session',
    imports: [DatePipe, ButtonModule, ChipModule, OverlayBadgeModule],
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

    @Input() session!: DoctorSession;

    @ViewChild('componentRef2') componentRef!: ElementRef;

    slots: Slot[] = [];

    fromTime!: Date;
    toTime!: Date;
    appointments: any[] = [];
    height!:string;
    expanded = false;

    constructor(private doctorService: DoctorService, private router: Router) {}

    ngOnInit(): void {
        if (this.session) {
            this.fromTime = new Date(this.session.from);
            this.toTime = new Date(this.session.to);
            this.setHeight();
            this.loadSessionSlots();
        }
    }

    goToConsult(){
        this.router.navigate(['/doctor/consult'], {
            state: {
                sessionData: this.session,
            }
        })
    }

    getTopOffset(): string {
        const fromHour = this.fromTime.getHours();
        const fromMinutes = this.fromTime.getMinutes();

        const totalMinutes = (fromHour - this.calendarConfig.startTime) * 60 + fromMinutes;
        const linesCount = fromHour - this.calendarConfig.startTime + 1;

        return `${totalMinutes + this.calendarConfig.calendarLineHeight * linesCount}px`;
    }

    loadSessionSlots(): void {
        this.doctorService.getSlotsForSession(this.session.session_id).subscribe({
            next: (response) => {
                this.slots = response;
                console.log('Session slots for session ' + this.session.session_id + ': ', this.slots);
            },
            error: (error) => {
                console.error('Error fetching session slots for session' + this.session.session_id + ': ', error);
            }
        });
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
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i].status === 'booked') {
                count++;
            }
        }
        return count;
    }

    isExpired(): boolean {
        const currentDate = new Date();
        const sessionDate = new Date(this.session.from);
        return sessionDate < currentDate;
    }
}
