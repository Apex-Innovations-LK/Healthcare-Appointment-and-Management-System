import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { HealthRecord } from '../../../models/doctor';
import { v4 as uuid } from 'uuid';
import { AuthStateService } from '../../../service/auth-state.service';
import { DoctorService } from '../../../service/doctor.service';

@Component({
    selector: 'app-add-new-hr',
    standalone: true,
    imports: [ButtonModule, InputTextModule, CommonModule, ReactiveFormsModule, FieldsetModule],
    template: `
        <div class="w-full p-4">
            <div class="font-semibold text-xl mb-6">Add Health Record</div>
            <div class="h-[50vh] p-5 overflow-y-auto">
                <form [formGroup]="recordForm" (ngSubmit)="submitRecord()" class="p-fluid">
                    <div class="flex flex-col gap-4">
                        <p-fieldset legend="Address">
                            <div class="mb-3 flex flex-col gap-2">
                                <label for="address">Address</label>
                                <input id="address" formControlName="address" pInputText class="w-full" />
                            </div>
                            <div class="mb-3 flex flex-col gap-2">
                                <label for="city">City</label>
                                <input id="city" formControlName="city" pInputText class="w-full" />
                            </div>
                            <div class="mb-3 flex flex-col gap-2">
                                <label for="state">State</label>
                                <input id="state" formControlName="state" pInputText class="w-full" />
                            </div>
                        </p-fieldset>
                        <div class="mb-3 flex flex-col gap-2">
                            <label for="zip" class="font-semibold">Zip Code</label>
                            <input id="zip" formControlName="zip" pInputText class="w-full" />
                        </div>
                        <ng-container *ngFor="let field of ['chief_complaint', 'allergies', 'medications', 'problem_list', 'lbf_data', 'his_data']">
                            <div class="mb-3">
                                <label class="block font-medium capitalize text-gray-700 mb-2" [for]="field">
                                    {{ field.replace('_', ' ') }}
                                </label>
                                <div [formArrayName]="field" class="ml-5">
                                    <div *ngFor="let ctrl of getFieldArray(field).controls; let i = index" class="flex items-center gap-2 mt-5 m-2">
                                        <input [formControlName]="i" pInputText class="w-full" [id]="field + '_' + i" />
                                        <button pButton icon="pi pi-times" (click)="removeFieldItem(field, i)" type="button" class="p-button-danger p-button-rounded p-button-sm"></button>
                                    </div>
                                </div>
                                <button pButton type="button" icon="pi pi-plus" label="Add" (click)="addFieldItem(field)" class="p-button-text mt-1" outlined></button>
                            </div>
                        </ng-container>
                    </div>
                    <div class="mt-6 text-right">
                        <button pButton label="Submit Record" type="submit" [disabled]="recordForm.invalid" icon="pi pi-check"></button>
                    </div>
                </form>
            </div>
        </div>
    `,
    styles: []
})
export class AddNewHRComponent {
    recordForm: FormGroup;

    @Input() patientInfo!: {
        patient_id: string;
        name: string;
        dob: string;
        sex: string;
        phone: string;
    };

    @Input() refreshHrView!: () => void;

    constructor(
        private fb: FormBuilder,
        private doctorService: DoctorService,
        private authStateService: AuthStateService
    ) {
        this.recordForm = this.fb.group({
            address: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            zip: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
            chief_complaint: this.fb.array([]),
            allergies: this.fb.array([]),
            medications: this.fb.array([]),
            problem_list: this.fb.array([]),
            lbf_data: this.fb.array([]),
            his_data: this.fb.array([])
        });
    }

    getFieldArray(field: string) {
        return this.recordForm.get(field) as FormArray;
    }

    addFieldItem(field: string) {
        this.getFieldArray(field).push(this.fb.control('', Validators.required));
    }

    removeFieldItem(field: string, index: number) {
        this.getFieldArray(field).removeAt(index);
    }

    formatDateToISO8601WithMillisecondsAndUTC(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

        // To get the UTC offset in the "Z" format (for UTC time),
        // we can simply use the toISOString() method and then adjust.
        // However, if you need the local time with offset, it's more complex.

        // Assuming you want UTC time with "Z"
        const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        const utcYear = utcDate.getUTCFullYear();
        const utcMonth = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
        const utcDay = String(utcDate.getUTCDate()).padStart(2, '0');
        const utcHours = String(utcDate.getUTCHours()).padStart(2, '0');
        const utcMinutes = String(utcDate.getUTCMinutes()).padStart(2, '0');
        const utcSeconds = String(utcDate.getUTCSeconds()).padStart(2, '0');
        const utcMilliseconds = String(utcDate.getUTCMilliseconds()).padStart(3, '0');

        return `${utcYear}-${utcMonth}-${utcDay}T${utcHours}:${utcMinutes}:${utcSeconds}.${utcMilliseconds}Z`;
    }

    submitRecord() {
        if (this.recordForm.valid) {
            const newRecord = this.recordForm.value;
            //const userDetails = this.authStateService.getUserDetails();
            //const doctor_id = userDetails ? userDetails.id : '';
            const doctor_id = '54b38592-bdfe-4d2f-b490-50fcb587e2fc';
            const record_id = uuid();
            // const dateOfService = this.formatDateToISO8601WithMillisecondsAndUTC(new Date());
            const dateOfService = new Date().toISOString();;

            const hr: HealthRecord = {
                record_id: record_id,
                patient_id: this.patientInfo.patient_id,
                patient_name: this.patientInfo.name,
                patient_dob: this.patientInfo.dob,
                date_of_service: dateOfService,
                referring_doctor: doctor_id,
                chief_complaint: newRecord.chief_complaint,
                allergies: newRecord.allergies,
                medications: newRecord.medications,
                problem_list: newRecord.problem_list,
                patient_sex: this.patientInfo.sex,
                address: newRecord.address,
                city: newRecord.city,
                state: newRecord.state,
                zip: newRecord.zip,
                patient_phone: this.patientInfo.phone,
                lbf_data: newRecord.lbf_data,
                his_data: newRecord.his_data
            };
            console.log('Submitting HR:', hr);

            this.doctorService.uploadHr(hr).subscribe({
                next: (response) => {
                    console.log('HR uploaded successfully', response);
                    this.recordForm.reset();
                    for (let key of Object.keys(this.recordForm.controls)) {
                        this.recordForm.setControl(key, this.fb.array([]));
                    }
                    this.refreshHrView();
                },
                error: (error) => {
                    console.error('Error uploading hr:', error);
                }
            });
        }
    }
}
