import { DatePipe } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { CalendarSessionComponent } from '../calendar-session/calendar-session.component';
import { ButtonModule } from 'primeng/button';
import { CalendarAvailabilityComponent } from '../calendar-availability/calendar-availability.component';
import { DoctorService } from '../../../../service/doctor.service';

@Component({
    selector: 'app-calendar-col',
    imports: [ButtonModule, DatePipe, CalendarAvailabilityComponent, CalendarSessionComponent],
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

    availabilities: any[] = [
        {
            from: '2025-05-03T08:30:00',
            to: '2025-05-03T10:00:00',
            patientsCount: 8,
            slots: [
                true, true, true, true, true, false, false, false
            ],
        },
        {
            from: '2025-05-08T17:00:00',
            to: '2025-05-08T22:00:00',
            patientsCount: 12,
            slots: [
                true, true, true, false, false, true, false, true, true, false, false, false
            ],
        }
    ];

    constructor(private doctorService: DoctorService) {}
    


    @Input() date!: Date;
    
    @Input() modalHandlers!:{
        addModalHandler: () => void;
        editModalHandler: () => void;
        deleteModalHandler: () => void;
        //rejectModalHandler: () => void;
      };

    @Input() calendarConfig!: {
        startTime: number;
        endTime: number;
        hourHeight: number;
        calendarLineHeight: number;
        calendarColHeight: number;
    };

    @Input() type!: 'schedule' | 'plan';

    lines: number[] = Array.from({ length: 19 });

    loadSessions() {
        const doctor_id = 'e7b5b3b4-8c9f-4e0c-ae90-6df45cbe9d24'; // Replace with actual doctor ID
        this.doctorService.getSessionsForDate(doctor_id, this.date.toISOString()).subscribe({
            next: (response) => {
                this.sessions = response;
                // console.log(this.sessions);
            },
            error: (error) => {
                console.error('Error fetching sessions for date'+this.date+': ', error);
            }
        });
    }

    loadAvailabilities() {
        const doctor_id = 'doctor_id'; // Replace with actual doctor ID
        this.doctorService.getAvailabilityForDate(doctor_id, this.date.toISOString()).subscribe({
            next: (response) => {
                this.availabilities = response;
            },
            error: (error) => {
                console.error('Error fetching availabilities for date'+this.date+': ', error);
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.calendarConfig) {
            this.lines = Array.from({ length: this.calendarConfig.endTime - this.calendarConfig.startTime + 2 });
        }
        if (this.type === 'schedule') {
            // this.loadSessions();
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
