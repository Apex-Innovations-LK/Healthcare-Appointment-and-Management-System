import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CalendarAvailabilityComponent } from './calenderAvailability';
import { SchedularService } from '../../../service/schedular.service';
import { AuthStateService } from '../../../service/auth-state.service';

@Component({
    selector: 'app-calendar-col',
    standalone: true,
    imports: [ButtonModule, CalendarAvailabilityComponent],
    template: `
        <div class="calendar-col flex flex-1 flex-col w-full items-center justify-end border-x-[1px]">
            <div class="day-col w-full flex flex-col justify-between overflow-hidden relative items-center" [style.height]="calendarConfig.calendarColHeight + 'px'">
                @for (line of lines; track $index) {
                    <div class="w-full h-[2px] calendar-divider"></div>
                }

                @if (type === 'plan' && availabilities.length > 0) {
                    @for (availability of availabilities; track $index) {
                        <app-calendar-availability class="m-0 p-0 w-full absolute flex flex-col items-center" [calendarConfig]="calendarConfig" [availability]="availability" />
                    }
                }

                @if (isToday()) {
                    <div class="z-50 now-divider w-full h-[5px] absolute" [style.top]="getNowDivTopOffset()"></div>
                }
            </div>
        </div>
    `
})
export class CalendarColComponent implements OnInit {
    availabilities: {
        from: string;
        to: string;
        doctorName: string;
    }[] = [];

    @Input() date!: Date;
    @Input() type!: 'schedule' | 'plan';

    @Input() modalHandlers!: {
        addModalHandler: () => void;
        editModalHandler: () => void;
        deleteModalHandler: () => void;
    };

    @Input() calendarConfig!: {
        startTime: number;
        endTime: number;
        hourHeight: number;
        calendarLineHeight: number;
        calendarColHeight: number;
    };

    lines: number[] = [];

    constructor(private schedularService: SchedularService, private authStateService : AuthStateService) {}

    ngOnInit(): void {
        const staff_id = this.authStateService.getUserDetails()?.id || '';
        // if (staff_id) {
            this.schedularService.getSchedule(staff_id).subscribe({
                next: (response: any[]) => {
                console.log("debug",response)
                    const flatList = Array.isArray(response[0]) ? response.flat() : response;

                    this.availabilities = flatList.map((item) => ({
                        from: item.from,
                        to: item.to,
                        doctorName: item.doctor_id || 'Unknown'
                    }));
                },
                error: (err) => {
                    console.error('Failed to load schedule:', err);
                }
            });
        }
        // else {
        //     console.error('Staff ID is not available');
        // }
   // }

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
        const now = new Date();
        const totalMinutes = (now.getHours() - this.calendarConfig.startTime) * 60 + now.getMinutes();
        const linesCount = now.getHours() - this.calendarConfig.startTime + 1;
        return `${totalMinutes + this.calendarConfig.calendarLineHeight * linesCount}px`;
    }
}
