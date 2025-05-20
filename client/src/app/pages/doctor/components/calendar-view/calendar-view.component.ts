import { Component, Input } from '@angular/core';
import { CalendarColComponent } from '../calendar-col/calendar-col.component';
import { DialogModule } from 'primeng/dialog';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DoctorAvailability, DoctorViewModalHandlers } from '../../../../models/doctor';
import { v4 as uuid } from 'uuid';
import { DoctorService } from '../../../../service/doctor.service';
import { SelectModule } from 'primeng/select';
import { ChipModule } from 'primeng/chip';
import { AuthStateService } from '../../../../service/auth-state.service';
import { NotificationService } from '../../../../service/notification.service';

@Component({
    selector: 'app-calendar-view',
    imports: [ChipModule, SelectModule, DialogModule, DatePipe, ButtonModule, InputTextModule, ReactiveFormsModule, CalendarColComponent],
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

    refreshColIndex: number = 10;
    displayAddModal = false;
    addDate!: Date;
    sessionForm!: FormGroup;

    addModalData: {
        dateId: number;
    } = {
        dateId: 0
    };

    constructor(
        private fb: FormBuilder,
        private doctorService: DoctorService,
        private authStateService: AuthStateService,
        private notificationService: NotificationService
    ) {
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
            this.generateCurrentWeek();
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

    toLocalISOString(date: Date): string {
        const offsetMs = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offsetMs);
        return localDate.toISOString().slice(0, -1); // remove trailing 'Z'
    }

    get selectedDateLabel(): string {
        const date = this.weekDates?.[this.addModalData?.dateId];
        return date ? new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : '';
    }

    submitAddForm() {
        if (this.sessionForm.valid) {
            const sessionData = this.sessionForm.value;
    
            const sessionId = uuid();
            const userDetails = this.authStateService.getUserDetails();
    
            if (!userDetails || !userDetails.id) {
                this.notificationService.showError('Failed to retrieve doctor details. Please log in again.', 'Error');
                return; // Exit the function if doctorId is invalid
            }
    
            const doctorId = userDetails.id;
            const date = this.weekDates[this.addModalData.dateId];
            const startTime = new Date(date);
            const endTime = new Date(date);
    
            const [startHour, startMinute] = sessionData.startTime.split(':').map(Number);
            const [endHour, endMinute] = sessionData.endTime.split(':').map(Number);
    
            startTime.setHours(startHour, startMinute, 0, 0);
            endTime.setHours(endHour, endMinute, 0, 0);
    
            const availability: DoctorAvailability = {
                session_id: sessionId,
                doctor_id: doctorId,
                from: startTime.toISOString(),
                to: endTime.toISOString(),
                number_of_patients: sessionData.numPatients
            };
    
            console.log('Availability:', availability);
    
            this.doctorService.addAvailability(availability).subscribe({
                next: (response) => {
                    console.log('Availability added successfully', response);
                    this.notificationService.showSuccess('Availability added successfully', 'Success');
                    this.sessionForm.reset({
                        startTime: '',
                        endTime: '',
                        numPatients: 1
                    });
                    this.refreshColIndex = this.addModalData.dateId;
    
                    setTimeout(() => (this.refreshColIndex = 10), 0);
                },
                error: (error) => {
                    this.notificationService.showError('Failed to add availability', 'Error');
                }
            });
        }
    }

    showAddModal(dateId: number) {
        this.addModalData.dateId = dateId;
        this.displayAddModal = true;
    }
}