import { Component, Input, SimpleChanges } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { HealthRecord, PatientGeneralInfo } from '../../../models/doctor';
import { DoctorService } from '../../../service/doctor.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-health-records',
    standalone: true,
    imports: [AccordionModule, ButtonModule, InputTextModule, CommonModule, ReactiveFormsModule, TabsModule, PanelModule, FieldsetModule],
    template: `
        <div class="p-4">
            <div class="font-semibold text-xl mb-4">Health Records</div>

            <div class="p-4 h-[50vh] overflow-y-auto">
            
            <!-- Show message if hrs array is empty -->
            <p *ngIf="hrs.length === 0" class="text-center text-gray-500">
                There are no health records relevant to this patient.
            </p>
            
            <p-accordion [multiple]="true">
                    <p-accordionTab *ngFor="let record of hrs" [header]="'Record: ' + record.record_id + ' (' + (record.date_of_service | date: 'medium') + ')'">
                        <p-fieldset legend="Issued Doctor">
                            <p class="mb-2">{{ record.referring_doctor }}</p>
                        </p-fieldset>
                        <p-fieldset legend="Chief Complaints">
                            <p *ngFor="let complaint of record.chief_complaint" class="mb-2">{{ complaint }}</p>
                        </p-fieldset>
                        <p-fieldset legend="Allergies">
                            <p *ngFor="let allergy of record.allergies" class="mb-2">{{ allergy }}</p>
                        </p-fieldset>
                        <p-fieldset legend="Medications">
                            <p *ngFor="let medication of record.medications" class="mb-2">{{ medication }}</p>
                        </p-fieldset>
                        <p-fieldset legend="Problems">
                            <p *ngFor="let problem of record.problem_list" class="mb-2">{{ problem }}</p>
                        </p-fieldset>
                        <p-fieldset legend="Address">
                            <p class="mb-2">{{ record.address + ', ' + record.city + ', ' + record.state }}</p>
                        </p-fieldset>
                        <p-fieldset legend="Zip Code">
                            <p class="mb-2">{{ record.zip }}</p>
                        </p-fieldset>
                        <p-fieldset legend="LBF Data">
                            <p *ngFor="let lbf of record.lbf_data" class="mb-2">{{ lbf }}</p>
                        </p-fieldset>
                        <p-fieldset legend="HIS Data">
                            <p *ngFor="let his of record.his_data" class="mb-2">{{ his }}</p>
                        </p-fieldset>
                    </p-accordionTab>
                </p-accordion>
            </div>
        </div>
    `,
    styles: []
})
export class HRViewComponent {
    @Input() patientInfo!: PatientGeneralInfo;

    hrs: HealthRecord[] = []; // Fetched from API

    @Input() refreshView!: boolean;



    constructor(private doctorService: DoctorService) {

    }

    loadHrs() {
        this.doctorService.getHrsByPatientId(this.patientInfo.patient_id).subscribe({
            next: (response) => {
                this.hrs = response;
                console.log('HRs fetched successfully');
            },
            error: (error) => {
                console.error('Error fetching hrs:', error);
            }
        });
    }

    ngOnInit() {
        this.loadHrs();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['refreshView'] && this.refreshView) {
            this.loadHrs();
        }
    }
}
