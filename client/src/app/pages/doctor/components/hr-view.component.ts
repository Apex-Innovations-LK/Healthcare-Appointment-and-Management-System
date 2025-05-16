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

    hrs: HealthRecord[] = [
        {
            record_id: 'HR-001',
            patient_id: 'PAT-33810',
            patient_name: 'Jesse Hatfield',
            patient_dob: '1966-09-12',
            date_of_service: '2025-03-17T22:33:43.643152+0000',
            referring_doctor: 'DR-45691',
            chief_complaint: ['Nausea', 'Headache'],
            allergies: ['Milk', 'Other', 'Eggs'],
            medications: ['Amlodipine', 'Metformin', 'Albuterol'],
            problem_list: ['Cholesterol', 'Arthritis', 'Asthma'],
            patient_sex: 'Female',
            address: '9241 Austin Well',
            city: 'Colombo',
            state: 'Western',
            zip: '00700',
            patient_phone: '0784059631',
            lbf_data: ['LBF101:5.3', 'LBF102:13.4', 'LBF103:123/85'],
            his_data: ['HIS006', 'HIS009']
        },
        {
            record_id: 'HR-002',
            patient_id: 'PAT-56505',
            patient_name: 'Elijah Sullivan',
            patient_dob: '1993-10-19',
            date_of_service: '2024-09-12T22:33:43.643152+0000',
            referring_doctor: 'DR-49454',
            chief_complaint: ['Nausea', 'Headache'],
            allergies: ['Dust', 'Pollen', 'Eggs'],
            medications: ['Other', 'Ibuprofen', 'Amoxicillin'],
            problem_list: ['Depression', 'Obesity', 'Other'],
            patient_sex: 'Female',
            address: '0831 Scott Harbors',
            city: 'Colombo',
            state: 'Western',
            zip: '00700',
            patient_phone: '0793623852',
            lbf_data: ['LBF101:6.1', 'LBF102:13.0', 'LBF103:113/83'],
            his_data: ['HIS003', 'HIS008']
        },
        {
            record_id: 'HR-003',
            patient_id: 'PAT-40322',
            patient_name: 'Diana Meza',
            patient_dob: '1965-03-23',
            date_of_service: '2024-12-13T22:33:43.644283+0000',
            referring_doctor: 'DR-90813',
            chief_complaint: ['Fever', 'Nausea'],
            allergies: ['Soy', 'Shellfish', 'Latex'],
            medications: ['Albuterol', 'Paracetamol', 'Lisinopril'],
            problem_list: ['Hypertension', 'Other', 'Anxiety'],
            patient_sex: 'Female',
            address: '47070 Perkins Lock Apt. 489',
            city: 'Colombo',
            state: 'Western',
            zip: '00700',
            patient_phone: '0751609845',
            lbf_data: ['LBF101:6.1', 'LBF102:12.0', 'LBF103:124/70'],
            his_data: ['HIS008', 'HIS005']
        },
        {
            record_id: 'HR-004',
            patient_id: 'PAT-18022',
            patient_name: 'Julie Gomez',
            patient_dob: '1934-08-31',
            date_of_service: '2024-05-04T22:33:43.644283+0000',
            referring_doctor: 'DR-74905',
            chief_complaint: ['Fatigue', 'Nausea'],
            allergies: ['Soy', 'Shellfish', 'Milk'],
            medications: ['Omeprazole', 'Amlodipine', 'Paracetamol'],
            problem_list: ['Arthritis', 'Anxiety', 'Hypertension'],
            patient_sex: 'Male',
            address: '96981 Anthony Spurs',
            city: 'Colombo',
            state: 'Western',
            zip: '00700',
            patient_phone: '0762844922',
            lbf_data: ['LBF101:4.3', 'LBF102:12.7', 'LBF103:100/89'],
            his_data: ['HIS009', 'HIS007']
        }
    ]; // Fetched from API

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
