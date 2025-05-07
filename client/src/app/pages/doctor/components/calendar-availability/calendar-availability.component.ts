import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-calendar-availability',
    imports: [DialogModule, DatePipe, ButtonModule, InputTextModule, ReactiveFormsModule],
    templateUrl: './calendar-availability.component.html',
    styleUrl: './calendar-availability.component.scss'
})
export class CalendarAvailabilityComponent {
    displayModal = false;
    sessionForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.sessionForm = this.fb.group({
            startTime: ['', Validators.required],
            endTime: ['', Validators.required],
            numPatients: [1, [Validators.required, Validators.min(1)]]
        });
    }
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
        patientsCount: number;
    };

    @Input() showEdit!: () => void;
    @Input() showDelete!: () => void;

    @ViewChild('componentRef') componentRef!: ElementRef;

    fromTime!: Date;
    toTime!: Date;
    height!: string;
    expanded = false;
    displayConfirmation: boolean = false;

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

    onMouseEnter(event: MouseEvent): void {
        this.expanded = true;
        const el = this.componentRef.nativeElement;

        const contentHeight = el.scrollHeight;
        const currentHeight = el.clientHeight;

        // Only update if content overflows
        if (contentHeight > currentHeight) {
            this.height = `${contentHeight}px`;
        }
    }

    onMouseLeave(event: MouseEvent): void {
        this.expanded = false;
        this.setHeight();
    }

    setOverflowY(): string {
        return this.expanded ? 'visible' : 'hidden';
    }

    openConfirmation() {
        this.displayConfirmation = true;
    }

    closeConfirmation() {
        this.displayConfirmation = false;
    }

    showDialog() {
      this.displayModal = true;
    }
  
    submitForm() {
      if (this.sessionForm.valid) {
        const sessionData = this.sessionForm.value;
        console.log('Session data:', sessionData);
  
        // TODO: Send this to backend or update your data model
  
        this.displayModal = false;
        this.sessionForm.reset({
          startTime: '',
          endTime: '',
          numPatients: 1,
        });
      }
    }
}
