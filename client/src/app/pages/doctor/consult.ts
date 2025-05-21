import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms'; // For ngModel
import { CommonModule } from '@angular/common';
import { PatientInfoComponent } from './components/patient-info.component';
import { SplitterModule } from 'primeng/splitter';
import { AddNewHRComponent } from './components/add-new-hr.component';
import { HRViewComponent } from './components/hr-view.component';
import { ButtonModule } from 'primeng/button';
import { DoctorService } from '../../service/doctor.service';
import { Router } from '@angular/router';
import { DoctorSession, Slot } from '../../models/doctor';
import { AuthStateService } from '../../service/auth-state.service';
import { NotificationService } from '../../service/notification.service';

@Component({
    selector: 'app-consult',
    imports: [CardModule, CalendarModule, DropdownModule, FormsModule, CommonModule, SplitterModule, PatientInfoComponent, AddNewHRComponent, HRViewComponent, ButtonModule],
    template: ` <div class="bg-surface-0 dark:bg-surface-900 flex flex-col items-center">
        <div class="flex flex-col landing-wrapper w-full items-center">
            <div class="card min-w-[60%]">
                <p-card class="w-full text-center" header="Session">
                    <ng-template pTemplate="content">
                        <div class="w-full mt-5 text-left flex gap-x-10 gap-y-5 flex-wrap">
                            <div class="mb-3 gap-5 flex flex-1 flex-col">
                                <label for="date">Date </label>
                                <p-calendar class="ml-5" id="date" [(ngModel)]="selectedDate" (ngModelChange)="onDateChange($event)" [inline]="false"></p-calendar>
                            </div>
                            <div class="mb-3 gap-5 flex flex-1 flex-col">
                                <label for="session">Session:</label>
                                <p-dropdown class="ml-5" id="session" [options]="sessionsList" [(ngModel)]="selectedSessionID" (ngModelChange)="onSessionChange($event)" optionLabel="name" optionValue="code" placeholder="Select a Session" [disabled]="!selectedDate"></p-dropdown>
                            </div>
                            <!-- <div class="mb-3 gap-5 flex flex-1 flex-col">
                                <label for="session">Slot:</label>
                                <p-dropdown class="ml-5" id="slot" [options]="slots" [(ngModel)]="selectedSlotIndex" (ngModelChange)="onSlotChange(selectedSlotIndex)" optionLabel="name" optionValue="code" placeholder="Select a Slot"></p-dropdown>
                            </div> -->
                            <label class="patient-key block mb-1" for="id"> Patient No. </label>
                            <div class="my-auto p-4 ml-10 border rounded-md px-3">{{ slots.length>0?currentPatientIndex + 1 + ' /' + slots.length:"0 /0" }}</div>
                        </div>
                        <div class="flex justify-between gap-4 mt-4">
                            <button pButton class="w-[100px]" type="button" icon="pi pi-arrow-left" label="Previous" (click)="prevSlot()" [disabled]="currentPatientIndex <= 0"></button>
                            <button pButton class="" type="button" icon="pi pi-phone" label="Start Teleconsultation" (click)="goToTelehealth()" [disabled]="!isVirtual"></button>
                            <button pButton class="w-[100px]" type="button" icon="pi pi-arrow-right" label="Next" (click)="nextSlot()" iconPos="right" [disabled]="currentPatientIndex >= slots.length-1"></button>
                        </div>
                    </ng-template>
                </p-card>
            </div>
        </div>

        <div class="card w-[96%] px-5  drop-shadow-md border-slate-200 border-2 border-solid rounded-lg mb-8">
            <p class="w-full text-center text-2xl font-semibold mb-8">Patient</p>
            
            <!-- Overlay -->
    <div *ngIf="(!selectedDate) || (!selectedSessionID) || slotIsRejected || slotIsNotBooked" class="overlay">
        <div class="overlay-content">
            <p *ngIf="slotIsRejected">This slot has been rejected by you.</p>
            <p *ngIf="slotIsNotBooked">This slot is not booked by any patient.</p>
            <p *ngIf="!selectedDate || !selectedSessionID">Please select respectively a date and a session to view deatils. Then you can move among slots of the selected session using next and previous buttons.</p>

        </div>
    </div>
            
            <p-splitter [style]="{ height: '60vh' }" [panelSizes]="[30, 40, 30]" [minSizes]="[10, 10, 10]" styleClass="mb-8">
                <ng-template #panel class="overflow-y-auto p-0">
                    <app-patient-info class="w-full" [patientInfo]="patientGeneralInfo"></app-patient-info>
                </ng-template>
                <ng-template #panel>
                    <app-add-new-hr [refreshHrView]="triggerHrViewRefresh" [patientInfo]="patientGeneralInfo" class="w-full" />
                </ng-template>
                <ng-template #panel>
                    <app-health-records [patientInfo]="patientGeneralInfo" [refreshView]="hrViewRefresh" class="w-full" />
                </ng-template>
            </p-splitter>
        </div>
    </div>`,
    styles: [`
        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;
            border-radius: 0.5rem; /* Match the card's border radius */
        }
        
        .overlay-content {
            color: white;
            font-size: 1.5rem;
            text-align: center;
            padding: 1rem;
            background-color: rgba(0, 0, 0, 0.7); /* Slightly darker background for text */
            border-radius: 0.5rem;
        }
    `]
})
export class Consult {
    receivedData?: any;
    hrViewRefresh: boolean = false;

    selectedDate: Date | null = null;
    selectedSession: DoctorSession = {} as DoctorSession;
    selectedSessionID: string | null = null;

    isVirtual = false;
    sessions: DoctorSession[] = [];
    slots: Slot[] = [];

    slotIsRejected = false;
    slotIsNotBooked = false;

    sessionsList: any[] = [];

    currentPatientIndex = 0;

    patientGeneralInfo = {
        id: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        phone_number: ''
    };

    constructor(
        private doctorService: DoctorService,
        private router: Router,
        private authStateService: AuthStateService,
        private notificationService: NotificationService
    ) {
        const navigation = this.router.getCurrentNavigation();
        this.receivedData = navigation?.extras.state?.['sessionData'] ?? null;
        if (this.receivedData) {
            this.selectedSession = this.receivedData;
            this.selectedDate = this.getStartOfDayTimestamp(new Date(this.selectedSession.from));
            this.loadSessions();
            this.selectedSessionID = this.selectedSession.session_id;
            this.loadSessionSlots();
        }
    }

    getStartOfDayTimestamp(timestamp: Date): Date {
        const date = new Date(timestamp);

        // Set hours, minutes, seconds, and milliseconds to 0
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        // Return the timestamp of the beginning of the day
        return date;
    }

    goToTelehealth() {
        this.router.navigate(['/doctor/telehealth']);
    }

    isNowBetweenTimes(startTime: string, endTime: string): boolean {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const now = new Date();
        return now >= start && now <= end;
    }

    triggerHrViewRefresh(): void {
        this.hrViewRefresh = true;
        setTimeout(() => (this.hrViewRefresh = false), 0);
    }

    toLocalISOString(date: Date): string {
        const offsetMs = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offsetMs);
        return localDate.toISOString().slice(0, -1); // remove trailing 'Z'
    }

    loadSessions(): void {
        const userDetails = this.authStateService.getUserDetails();

        if (!userDetails || !userDetails.id) {
            this.notificationService.showError('Failed to retrieve doctor details. Please log in again.', 'Error');
            return; // Exit the function if doctorId is invalid
        }
        const doctor_id = userDetails.id;
        //const doctor_id = '54b38592-bdfe-4d2f-b490-50fcb587e2fc';

        this.doctorService.getSessionsForDate(doctor_id, this.toLocalISOString(this.selectedDate ?? new Date())).subscribe({
            next: (response) => {
                this.sessions = response;
                this.sessionsList = this.sessions.map((session) => {
                    const from = new Date(session.from).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
                    const to = new Date(session.to).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
                    return {
                        name: `${from}-${to}`,
                        code: session.session_id
                    };
                });
                console.log(this.toLocalISOString(this.selectedDate ?? new Date()), this.sessions);
            },
            error: (error) => {
                console.error('Error fetching sessions for date' + (this.selectedDate ?? new Date()) + ': ', error);
            }
        });
    }

    loadSessionSlots(): void {
        this.doctorService.getSlotsForSession(this.selectedSession.session_id).subscribe({
            next: (response) => {
                this.slots = response;
                this.currentPatientIndex = 0;
                //console.log('Session slots for session ' + this.selectedSession.session_id + ': ', this.slots);
                this.loadPatient();
            },
            error: (error) => {
                console.error('Error fetching session slots for session' + this.selectedSession.session_id + ': ', error);
            }
        });
    }

    loadPatientData(patient_id: string) {
        this.doctorService.getPatientGeneralInfo(patient_id).subscribe({
            next: (response) => {
                this.patientGeneralInfo = response;
                console.log('Successfully fetched patient info relevant to slot ',response);
            },
            error: (error) => {
                console.error('Error fetching patient info relevant to slot' + this.slots[this.currentPatientIndex].slotId + ': ', error);
            }
        });
    }

    loadPatient() {
        const selectedSlot = this.slots[this.currentPatientIndex];
        const slot_id = selectedSlot.slotId;

        if (selectedSlot.status === 'rejected') {
            this.slotIsRejected = true;
        } else if (selectedSlot.status === 'available') {
            this.slotIsNotBooked = true;
        } else {
            this.slotIsRejected = false;
            this.slotIsNotBooked = false;
            //console.log('selected slot id'+selectedSlot+ "index "+this.currentPatientIndex+this.slots);

            this.doctorService.getSlotDataBySlotId(slot_id).subscribe({
                next: (response) => {
                    const patient_id = response.patient_id;
                    this.isVirtual = this.isNowBetweenTimes(this.selectedSession.from, this.selectedSession.to) && response.appoinment_type == 'VIRTUAL';
                    // console.log(' for session ' + this.session.session_id + ': ', this.slots);
                    this.loadPatientData(patient_id);
                },
                error: (error) => {
                    console.error('Error fetching patient for slot - ' + slot_id + ': ', error);
                }
            });
        }
    }

    onDateChange(newDate: Date | null) {
        //console.log('Date changed:', this.selectedDate);
        this.loadSessions();
    }

    onSessionChange(newSessionId: string | null) {
        let filteredSessions = this.sessions.filter((session) => session.session_id === newSessionId);
        if (filteredSessions.length > 0) {
            this.selectedSession = filteredSessions[0];
            this.loadSessionSlots();
        }
        // console.log('Session changed:', newSessionId);
    }

    // onSlotChange(newSlot: any | null) {
    //     console.log('Slot changed:', newSlot);
    //     // Add your logic to handle slot changes here
    // }

    nextSlot() {
        if (this.currentPatientIndex < this.slots.length - 1) {
            this.currentPatientIndex++;
            this.loadPatient();
            this.triggerHrViewRefresh();
            // console.log('selected slot '+this.selected)
        }
    }

    prevSlot() {
        if (this.currentPatientIndex > 0) {
            this.currentPatientIndex--;
            this.loadPatient();
            this.triggerHrViewRefresh();
        }
    }
}