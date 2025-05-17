import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportService } from '../services/report.service';
import { ReportRequest, ReportData } from '../models/report.model';
import { MessageService } from 'primeng/api';
import { saveAs } from 'file-saver';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-report-builder',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToastModule, TabViewModule, DropdownModule, CalendarModule, MultiSelectModule, ButtonModule, TableModule],
    template: `
        <p-toast></p-toast>
        <div class="max-w-7xl mx-auto p-6">
            <div *ngIf="loading" class="flex justify-center items-center mb-4">
                <i class="pi pi-spin pi-spinner text-3xl text-blue-600"></i>
                <span class="ml-2 text-blue-700 font-semibold">Loading...</span>
            </div>
            <div class="bg-white shadow-md rounded-lg p-6">
                <h2 class="text-2xl font-bold mb-6">Report Builder</h2>
                <form [formGroup]="reportForm" class="space-y-6">
                    <p-tabView>
                        <p-tabPanel header="Configuration">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label for="reportType" class="block text-sm font-medium text-gray-700">Report Type</label>
                                    <p-dropdown id="reportType" formControlName="reportType" [options]="reportTypes" optionLabel="label" optionValue="value" placeholder="Select Report Type" class="w-full" [autoDisplayFirst]="false"></p-dropdown>
                                </div>
                                <div>
                                    <label for="startDate" class="block text-sm font-medium text-gray-700">Start Date</label>
                                    <p-calendar id="startDate" formControlName="startDate" dateFormat="yy-mm-dd" placeholder="YYYY-MM-DD" class="w-full"></p-calendar>
                                </div>
                                <div>
                                    <label for="endDate" class="block text-sm font-medium text-gray-700">End Date</label>
                                    <p-calendar id="endDate" formControlName="endDate" dateFormat="yy-mm-dd" placeholder="YYYY-MM-DD" class="w-full"></p-calendar>
                                </div>
                                <div>
                                    <label for="patientType" class="block text-sm font-medium text-gray-700">Patient Type</label>
                                    <p-dropdown id="patientType" formControlName="patientType" [options]="patientTypes" placeholder="Select Patient Type" class="w-full" [autoDisplayFirst]="false"></p-dropdown>
                                </div>
                                <div>
                                    <label for="patientSex" class="block text-sm font-medium text-gray-700">Sex</label>
                                    <p-dropdown id="patientSex" formControlName="patientSex" [options]="sexes" placeholder="Select Sex" class="w-full" [autoDisplayFirst]="false"></p-dropdown>
                                </div>
                                <div>
                                    <label for="ageRange" class="block text-sm font-medium text-gray-700">Age Range</label>
                                    <p-dropdown id="ageRange" formControlName="ageRange" [options]="ageRanges" placeholder="Select Age Range" class="w-full" [autoDisplayFirst]="false"></p-dropdown>
                                </div>
                                <div>
                                    <label for="city" class="block text-sm font-medium text-gray-700">City</label>
                                    <p-dropdown id="city" formControlName="city" [options]="cities" placeholder="Select City" class="w-full" [autoDisplayFirst]="false"></p-dropdown>
                                </div>
                                <div>
                                    <label for="state" class="block text-sm font-medium text-gray-700">State</label>
                                    <p-dropdown id="state" formControlName="state" [options]="states" placeholder="Select State" class="w-full" [autoDisplayFirst]="false"></p-dropdown>
                                </div>
                                <div>
                                    <label for="allergies" class="block text-sm font-medium text-gray-700">Allergies</label>
                                    <p-multiSelect id="allergies" formControlName="allergies" [options]="allergies" placeholder="Select Allergies" class="w-full"></p-multiSelect>
                                </div>
                                <div>
                                    <label for="medications" class="block text-sm font-medium text-gray-700">Medications</label>
                                    <p-multiSelect id="medications" formControlName="medications" [options]="medications" placeholder="Select Medications" class="w-full"></p-multiSelect>
                                </div>
                            </div>
                            <div class="mt-6 flex space-x-4">
                                <p-button label="Generate Report" icon="pi pi-check" (click)="generateReport()" styleClass="p-button-primary"></p-button>
                                <p-button label="Export CSV" icon="pi pi-download" (click)="exportCsv()" styleClass="p-button-secondary"></p-button>
                            </div>
                        </p-tabPanel>
                    </p-tabView>
                </form>
            </div>

            <div class="bg-white shadow-md rounded-lg p-6 mt-6" *ngIf="reportData?.data">
                <h2 class="text-2xl font-bold mb-4 text-gray-800">Report Preview</h2>
                <p-table [value]="safeReportData" [columns]="displayedColumns" responsiveLayout="scroll" [tableStyle]="{ 'min-width': '50rem' }" styleClass="p-datatable-striped p-datatable-gridlines" [rowHover]="true">
                    <ng-template pTemplate="header">
                        <tr>
                            <th *ngFor="let col of displayedColumns" class="px-4 py-2 text-left" [pSortableColumn]="col">
                                {{ col.replace('_', ' ') | titlecase }}
                                <p-sortIcon [field]="col"></p-sortIcon>
                            </th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-row>
                        <tr class="hover:bg-gray-100 transition-colors">
                            <td *ngFor="let col of displayedColumns" class="px-4 py-2">
                                {{ row[col] }}
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>
    `,
    styles: [
        `
            .p-calendar input:focus,
            .p-dropdown:focus {
                outline: none;
            }
            :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
                background-color: #f8fafc;
                color: #1f2937;
                font-weight: 600;
                border-bottom: 2px solid #e5e7eb;
            }
            :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
                border-bottom: 1px solid #e5e7eb;
            }
            :host ::ng-deep .p-datatable .p-sortable-column .p-sortIcon {
                color: #6b7280;
            }
            :host ::ng-deep .p-datatable .p-sortable-column:hover .p-sortIcon {
                color: #1f2937;
            }
        `
    ],
    providers: [MessageService]
})
export class ReportBuilderComponent implements OnInit {
    reportForm: FormGroup;
    reportTypes = [
        { label: 'Patient Visits', value: 'patient_visits' },
        { label: 'Diagnosis Summary', value: 'diagnosis_summary' },
        { label: 'Demographic Summary', value: 'demographic_summary' }
    ];
    patientTypes = ['Hypertension', 'Diabetes', 'Asthma', 'Migraines', 'Arthritis', 'Cholesterol', 'Anxiety', 'Depression', 'Obesity', 'Back Pain', 'Other'];
    sexes = ['Male', 'Female'];
    ageRanges = ['0-30', '30-60', '60+'];
    cities = ['Colombo', 'Galle', 'Kandy', 'Matara', 'Jaffna', 'Kurunegala'];
    states = ['Western', 'Southern', 'Central', 'Northern', 'North Western'];
    allergies = ['Penicillin', 'Pollen', 'Dust', 'Nuts', 'Shellfish', 'Ibuprofen', 'Latex', 'Milk', 'Eggs', 'Soy', 'Other'];
    medications = ['Paracetamol', 'Amoxicillin', 'Metformin', 'Ibuprofen', 'Atorvastatin', 'Omeprazole', 'Amlodipine', 'Lisinopril', 'Albuterol', 'Prednisone', 'Other'];

    reportData: ReportData | null = null;
    displayedColumns: string[] = [];
    loading = false;

    constructor(
        private fb: FormBuilder,
        private reportService: ReportService,
        private messageService: MessageService
    ) {
        this.reportForm = this.fb.group({
            reportType: ['', Validators.required],
            startDate: [''],
            endDate: [''],
            patientType: [''],
            patientSex: [''],
            ageRange: [''],
            city: [''],
            state: [''],
            allergies: [[]],
            medications: [[]]
        });
    }

    ngOnInit(): void {}

    get safeReportData(): Record<string, any>[] {
        if (!this.reportData?.data) return [];
        return this.reportData.data.map((row) => {
            const newRow: Record<string, any> = { ...row };
            for (const key in newRow) {
                if (Array.isArray(newRow[key])) {
                    newRow[key] = newRow[key].join(', ');
                }
            }
            return newRow;
        });
    }

    private formatDate(date: any): string | null {
        if (!date) return null;
        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
        if (date instanceof Date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        return null;
    }

    private formatRequest(formValue: any): ReportRequest {
        const request = {
            reportType: formValue.reportType,
            startDate: this.formatDate(formValue.startDate) || undefined,
            endDate: this.formatDate(formValue.endDate) || undefined,
            patientType: formValue.patientType || null,
            patientSex: formValue.patientSex || null,
            ageRange: formValue.ageRange || null,
            city: formValue.city || null,
            state: formValue.state || null,
            allergies: formValue.allergies?.length ? formValue.allergies : null,
            medications: formValue.medications?.length ? formValue.medications : null
        };
        console.log('Sending request:', request); // Debug payload
        return request;
    }

    generateReport(): void {
        if (this.reportForm.invalid) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select a report type' });
            return;
        }

        this.loading = true;
        const request: ReportRequest = this.formatRequest(this.reportForm.value);
        this.reportService.generateReport(request).subscribe({
            next: (data: ReportData) => {
                this.reportData = data;
                this.displayedColumns = this.getDisplayedColumns(request.reportType);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Report generated successfully' });
                this.loading = false;
            },
            error: (error: Error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
                this.loading = false;
            }
        });
    }

    exportCsv(): void {
        if (this.reportForm.invalid) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select a report type' });
            return;
        }

        this.loading = true;
        const request: ReportRequest = this.formatRequest(this.reportForm.value);
        this.reportService.exportCsv(request).subscribe({
            next: (blob: Blob) => {
                saveAs(blob, `${request.reportType}_${request.startDate || 'all'}_${request.endDate || 'all'}.csv`);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'CSV downloaded successfully' });
                this.loading = false;
            },
            error: (error: Error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
                this.loading = false;
            }
        });
    }

    private getDisplayedColumns(reportType: string): string[] {
        switch (reportType) {
            case 'patient_visits':
                return ['record_id', 'patient_id', 'patient_name', 'date_of_service', 'chief_complaint', 'problem_list', 'patient_sex', 'city'];
            case 'diagnosis_summary':
                return ['record_id', 'patient_id', 'patient_name', 'problem_list', 'medications'];
            case 'demographic_summary':
                return ['patient_id', 'patient_name', 'patient_sex', 'patient_dob', 'city', 'state'];
            default:
                return ['record_id', 'patient_id', 'patient_name'];
        }
    }
}
