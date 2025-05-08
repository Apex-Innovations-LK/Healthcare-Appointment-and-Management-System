import { Component, Input, SimpleChanges } from '@angular/core';
import { CalendarSessionComponent } from '../calendar-session/calendar-session.component';
import { ButtonModule } from 'primeng/button';
import { CalendarAvailabilityComponent } from '../calendar-availability/calendar-availability.component';
import { DoctorService } from '../../../../service/doctor.service';
import { DoctorAvailability, DoctorSession, DoctorViewModalHandlers } from '../../../../models/doctor';
import { ChipModule } from 'primeng/chip';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { DatePipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStateService } from '../../../../service/auth-state.service';

@Component({
    selector: 'app-calendar-col',
    imports: [ChipModule, SelectModule, DialogModule, ButtonModule, InputTextModule, ReactiveFormsModule, CalendarAvailabilityComponent, CalendarSessionComponent, DatePipe],
    templateUrl: './calendar-col.component.html',
    styleUrl: './calendar-col.component.scss'
})
export class CalendarColComponent {
    sessions: DoctorSession[] = [
        // {
        //     session_id: 'ec7d002a-2afe-11f0-9306-325096b39f47',
        //     doctor_id: 'e7b5b3b4-8c9f-4e0c-ae90-6df45cbe9d24',
        //     from: '2025-05-07T10:30:00.000+00:00',
        //     to: '2025-05-07T13:00:00.000+00:00',
        //     patientsCount: 10
        // }
    ];

    availabilities: DoctorAvailability[] = [];

    displayEditModal = false;
    displayDeleteModal = false;

    activeAvailability: DoctorAvailability = {
        session_id: '',
        doctor_id: '',
        from: '',
        to: '',
        number_of_patients: 0
    };

    sessionForm!: FormGroup;
    modalHandlers: DoctorViewModalHandlers = {
        editModalHandler: this.showEditModal.bind(this),
        deleteModalHandler: this.showDeleteModal.bind(this)
    };

    constructor(
        private fb: FormBuilder,
        private doctorService: DoctorService,
        private authStateService: AuthStateService
    ) {
        this.sessionForm = this.fb.group({
            startTime: ['', Validators.required],
            endTime: ['', Validators.required],
            numPatients: [1, [Validators.required, Validators.min(1)]]
        });
    }

    @Input() date!: Date;

    @Input() refreshCol!: boolean;

    @Input() calendarConfig!: {
        startTime: number;
        endTime: number;
        hourHeight: number;
        calendarLineHeight: number;
        calendarColHeight: number;
    };

    @Input() type!: 'schedule' | 'plan';

    lines: number[] = Array.from({ length: 19 });

    toLocalISOString(date: Date): string {
        const offsetMs = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offsetMs);
        return localDate.toISOString().slice(0, -1); // remove trailing 'Z'
    }

    loadSessions(): void {
        const userDetails = this.authStateService.getUserDetails();
        const doctor_id = userDetails ? userDetails.id : '';
        //const doctor_id = '54b38592-bdfe-4d2f-b490-50fcb587e2fc';
        this.doctorService.getSessionsForDate(doctor_id, this.toLocalISOString(this.date)).subscribe({
            next: (response) => {
                this.sessions = response;
                console.log(this.toLocalISOString(this.date), this.sessions);
            },
            error: (error) => {
                console.error('Error fetching sessions for date' + this.date + ': ', error);
            }
        });
    }

    loadAvailabilities() {
        const userDetails = this.authStateService.getUserDetails();
        const doctor_id = userDetails ? userDetails.id : '';
        //const doctor_id = '54b38592-bdfe-4d2f-b490-50fcb587e2fc';
        this.doctorService.getAvailabilityForDate(doctor_id, this.toLocalISOString(this.date)).subscribe({
            next: (response) => {
                this.availabilities = response;
            },
            error: (error) => {
                console.error('Error fetching availabilities for date' + this.date + ': ', error);
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['refreshCol'] && this.refreshCol) {
            if (this.type === 'plan') {
                // console.log('Refreshing calendar column for plan view...');
                this.loadAvailabilities();
            }
        }
    }

    ngOnInit(): void {
        if (this.calendarConfig) {
            this.lines = Array.from({ length: this.calendarConfig.endTime - this.calendarConfig.startTime + 2 });
        }
        if (this.type === 'schedule') {
            this.loadSessions();
        } else if (this.type === 'plan') {
            this.loadAvailabilities();
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

    submitEditForm() {
        if (this.sessionForm.valid) {
            const sessionData = this.sessionForm.value;

            const sessionId = this.activeAvailability.session_id;
            const doctorId = this.activeAvailability.doctor_id;
            const originalDate = new Date(this.activeAvailability.from);
            const date = new Date(originalDate.getFullYear(), originalDate.getMonth(), originalDate.getDate());
            // TODO: Send this to backend or update your data model
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

            this.doctorService.updateAvailability(availability).subscribe({
                next: (response) => {
                    console.log('Availability updated successfully', response);
                    this.loadAvailabilities(); // Refresh the availabilities after update

                    this.sessionForm.reset({
                        startTime: '',
                        endTime: '',
                        numPatients: 1
                    });
                    this.displayEditModal = false;
                },
                error: (error) => {
                    console.error('Error updating availability', error);
                }
            });
        }
    }

    deleteSession() {
        this.doctorService.deleteAvailability(this.activeAvailability).subscribe({
            next: (response) => {
                console.log('Availability deleted successfully', response);
                this.loadAvailabilities(); // Refresh the availabilities after deletion
                this.displayDeleteModal = false;
            },
            error: (error) => {
                console.error('Error deleting availability', error);
            }
        });
    }

    showEditModal(availability: DoctorAvailability) {
        this.activeAvailability = availability;

        const formatTime = (date: Date): string => {
            return this.toLocalISOString(date).substring(11, 16); // "HH:mm"
        };

        this.sessionForm.patchValue({
            startTime: formatTime(new Date(availability.from)),
            endTime: formatTime(new Date(availability.to)),
            numPatients: availability.number_of_patients
        });

        this.displayEditModal = true;
    }

    showDeleteModal(availability: DoctorAvailability) {
        this.activeAvailability = availability;
        this.displayDeleteModal = true;
    }
}
