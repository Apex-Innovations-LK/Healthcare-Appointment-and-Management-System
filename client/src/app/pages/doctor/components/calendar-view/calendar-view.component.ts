import { Component, Input } from '@angular/core';
import { CalendarColComponent } from '../calendar-col/calendar-col.component';
import { DialogModule } from 'primeng/dialog';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-calendar-view',
    imports: [DialogModule, DatePipe, ButtonModule, InputTextModule, ReactiveFormsModule, CalendarColComponent],
    templateUrl: './calendar-view.component.html',
    styleUrl: './calendar-view.component.scss'
})
export class CalendarViewComponent {
    weekDates: Date[] = [];

    @Input() calendarConfig!: {
        startTime: number;
        endTime: number;
        hourHeight: number;
        calendarLineHeight: number;
        calendarColHeight: number;
    };

    @Input() type!: 'schedule' | 'plan';

    displayAddModal = false;
    displayEditModal = false;
    displayDeleteModal = false;
    sessionForm: FormGroup;
    addDate!: Date;
    actionSessionId!: string;
    modalHandlers:{
      addModalHandler: () => void;
      editModalHandler: () => void;
      deleteModalHandler: () => void;
      //rejectModalHandler: () => void;
    } = {
      addModalHandler: this.showAddModal.bind(this),
      editModalHandler: this.showEditModal.bind(this),
      deleteModalHandler: this.showDeleteModal.bind(this),
    };

    constructor(private fb: FormBuilder) {
        this.sessionForm = this.fb.group({
            startTime: ['', Validators.required],
            endTime: ['', Validators.required],
            numPatients: [1, [Validators.required, Validators.min(1)]]
        });
    }

    ngOnInit() {
        if (this.type === 'schedule') {
            this.generateCurrentWeek();
        } else if (this.type === 'plan') {
            this.generateNextWeek();
        }
    }

    generateCurrentWeek() {
        const today = new Date();

        // Get the day index (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const dayOfWeek = today.getDay();

        // Calculate difference to Monday
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // handle Sunday (0) as -6

        // Get this week's Monday
        const monday = new Date(today);
        monday.setDate(today.getDate() + diffToMonday);
        monday.setHours(0, 0, 0, 0); // reset to midnight

        // Create list of 7 days
        this.weekDates = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            return date;
        });
    }

    generateNextWeek() {
        const today = new Date();

        // Get the day index (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const dayOfWeek = today.getDay();

        // Calculate difference to Monday (treat Sunday as -6)
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

        // Find this week's Monday and then move to next week's Monday
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + diffToMonday + 7);
        nextMonday.setHours(0, 0, 0, 0); // reset to midnight

        // Generate next week's dates (Monday to Sunday)
        this.weekDates = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(nextMonday);
            date.setDate(nextMonday.getDate() + i);
            return date;
        });
    }

    get timeLabels(): string[] {
        return Array.from({ length: this.calendarConfig.endTime - this.calendarConfig.startTime }, (_, i) => {
            const hour = this.calendarConfig.startTime + i + 1;
            const label = hour == 24 ? '12 AM -' : hour == 12 ? '12 PM -' : hour > 12 ? `${hour - 12} PM -` : `${hour} AM -`;
            return label;
        });
    }

    submitAddForm() {
      if (this.sessionForm.valid) {
        const sessionData = this.sessionForm.value;
        console.log('Session data:', sessionData);
  
        // TODO: Send this to backend or update your data model
  
        this.displayAddModal = false;
        this.sessionForm.reset({
          startTime: '',
          endTime: '',
          numPatients: 1,
        });
      }
    }

    submitEditForm() {
      if (this.sessionForm.valid) {
        const sessionData = this.sessionForm.value;
  
        // TODO: Send this to backend or update your data model
  
        this.displayEditModal = false;
        this.sessionForm.reset({
          startTime: '',
          endTime: '',
          numPatients: 1,
        });
      }
    }

    deleteSession() {
    }

    showAddModal() {
      this.displayAddModal = true;
    }

    showEditModal() {
      this.displayEditModal = true;
    }

    showDeleteModal() {
      this.displayDeleteModal = true;
    }
}
