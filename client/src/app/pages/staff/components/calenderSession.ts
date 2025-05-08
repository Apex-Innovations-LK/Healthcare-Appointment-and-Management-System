import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { Schedule } from '../../../models/schedule';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-calendar-session',
    standalone: true,
    imports: [DatePipe, ButtonModule, ChipModule, TooltipModule, CommonModule],
    template: `
        <div
            class="calendar-session w-[95%] p-2 flex flex-col items-start justify-start overflow-hidden rounded-lg absolute 
                   transition-all duration-200 ease-in-out cursor-pointer border-l-4 shadow-md hover:shadow-lg"
            [ngClass]="getSessionClass()"
            [style.top]="getTopOffset()"
            [style.height]="height"
            [style.z-index]="expanded ? 20 : 10"
            (mouseenter)="onMouseEnter()"
            (mouseleave)="onMouseLeave()"
            [pTooltip]="doctorId"
            tooltipPosition="right"
            #componentRef2
        >
            <div class="flex w-full justify-between items-center mb-1">
                <p class="time-duration text-sm font-semibold m-0 text-blue-700 dark:text-blue-300">{{ fromTime | date: 'shortTime' }} - {{ toTime | date: 'shortTime' }}</p>
                <div class="status-indicator h-2 w-2 rounded-full" [ngClass]="{ 'bg-green-500': isActive(), 'bg-gray-400': !isActive() }"></div>
            </div>

            <div class="flex flex-col w-full gap-1">
                <p class="key-staff text-xs m-0 truncate" [class.font-semibold]="expanded">ID: {{ doctorId }}</p>
                <div *ngIf="expanded" class="transition-all duration-300 ease-in-out" [class.opacity-100]="expanded" [class.opacity-0]="!expanded">
                    <p-chip [label]="getDoctorName()" class="text-xs" styleClass="bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200"></p-chip>
                    <div class="mt-2 flex justify-end w-full">
                        <button pButton icon="pi pi-pencil" class="p-button-sm p-button-text p-button-rounded mr-1"></button>
                        <button pButton icon="pi pi-trash" class="p-button-sm p-button-text p-button-rounded p-button-danger"></button>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class CalendarSessionComponent implements OnInit {
    @Input() calendarConfig!: {
        startTime: number;
        endTime: number;
        hourHeight: number;
        calendarLineHeight: number;
        calendarColHeight: number;
    };

    @Input() sessionData!: Schedule;

    @ViewChild('componentRef2') componentRef!: ElementRef;

    fromTime!: Date;
    toTime!: Date;
    doctorId!: string;
    height!: string;
    items: MenuItem[] = [];
    expanded = false;
    baseHeight!: string;

    private doctorMap: Record<string, string> = {
        '366eb193-2bb2-4c04-8cb5-d08dc2c26ad8': 'Dr. John Doe',
        '72e8d755-53f5-439c-bd40-4aefa7b96449': 'Dr. Jane Smith',
        '4b287d94-d3e6-4460-9cb3-0ed6d6f5cd69': 'Dr. Alex Johnson'
    };

    ngOnInit(): void {
        this.initializeComponent();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['sessionData'] && this.sessionData) {
            this.initializeComponent();
        }
    }

    initializeComponent(): void {
        if (this.sessionData) {
            console.log('debug point', this.sessionData);
            // Safely handle the date objects
            this.fromTime = this.sessionData.from instanceof Date ? this.sessionData.from : this.sessionData.from ? new Date(this.sessionData.from) : new Date();

            this.toTime = this.sessionData.to instanceof Date ? this.sessionData.to : this.sessionData.to ? new Date(this.sessionData.to) : new Date();

            this.doctorId = this.sessionData.doctor_id;
            this.setHeight();
            this.baseHeight = this.height;
        }
    }
    getTopOffset(): string {
        if (!this.fromTime || !this.calendarConfig) return '0px';

        const fromHour = this.fromTime.getHours();
        const fromMinutes = this.fromTime.getMinutes();

        // Calculate minutes from start time
        const totalMinutes = (fromHour - this.calendarConfig.startTime) * 60 + fromMinutes;

        // Calculate the number of hour lines crossed (for border adjustments)
        const hoursFromStart = fromHour - this.calendarConfig.startTime;
        const linesCount = hoursFromStart >= 0 ? hoursFromStart : 0;

        // Calculate the pixel position
        const minutesOffset = totalMinutes * (this.calendarConfig.hourHeight / 60);
        const lineOffset = linesCount * this.calendarConfig.calendarLineHeight;

        return `${minutesOffset + lineOffset}px`;
    }

    setHeight(): void {
        if (!this.fromTime || !this.toTime || !this.calendarConfig) return;

        // Calculate difference in minutes
        const diffMinutes = Math.floor((this.toTime.getTime() - this.fromTime.getTime()) / (1000 * 60));

        // Calculate height in pixels
        const minuteHeight = this.calendarConfig.hourHeight / 60;
        const height = diffMinutes * minuteHeight;

        this.height = `${Math.max(height, 30)}px`; // Minimum height for visibility
    }

    onMouseEnter(): void {
        this.expanded = true;
        // Store minimum needed height based on time difference
        if (!this.baseHeight) this.baseHeight = this.height;

        // Calculate expanded height (original + additional space for expanded content)
        const minHeight = parseInt(this.baseHeight.replace('px', ''));
        this.height = `${Math.max(minHeight, 80)}px`;
    }

    onMouseLeave(): void {
        this.expanded = false;
        this.height = this.baseHeight;
    }

    isActive(): boolean {
        if (!this.fromTime || !this.toTime) return false;

        const now = new Date();
        return now >= this.fromTime && now <= this.toTime;
    }

    getDoctorName(): string {
        return this.doctorMap[this.doctorId] || `Doctor (${this.doctorId.substring(0, 8)}...)`;
    }

    getSessionClass(): string {

        const colorMap: Record<string, string> = {
            '366eb193-2bb2-4c04-8cb5-d08dc2c26ad8': 'bg-blue-50 dark:bg-blue-900/40 border-blue-500 dark:border-blue-400',
            '72e8d755-53f5-439c-bd40-4aefa7b96449': 'bg-green-50 dark:bg-green-900/40 border-green-500 dark:border-green-400',
            '4b287d94-d3e6-4460-9cb3-0ed6d6f5cd69': 'bg-purple-50 dark:bg-purple-900/40 border-purple-500 dark:border-purple-400'
        };

        return colorMap[this.doctorId] || 'bg-gray-50 dark:bg-gray-900/40 border-gray-500 dark:border-gray-400';
    }
}
