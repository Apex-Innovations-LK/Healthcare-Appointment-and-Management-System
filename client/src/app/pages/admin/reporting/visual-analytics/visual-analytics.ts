import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportService } from '../services/report.service';
import { ReportRequest, VisualizationData } from '../models/report.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';

@Component({
    selector: 'app-visual-analytics',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToastModule, DropdownModule, CalendarModule, ButtonModule, ChartModule],
    template: `
        <p-toast></p-toast>
        <div class="max-w-7xl mx-auto p-6">
            <div class="bg-white shadow-md rounded-lg p-6">
                <h2 class="text-2xl font-bold mb-6">Visual Analytics</h2>
                <form [formGroup]="filterForm" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div>
                            <label for="startDate" class="block text-sm font-medium text-gray-700">Start Date</label>
                            <p-calendar id="startDate" formControlName="startDate" dateFormat="yy-mm-dd" placeholder="YYYY-MM-DD" class="w-full"></p-calendar>
                        </div>
                        <div>
                            <label for="endDate" class="block text-sm font-medium text-gray-700">End Date</label>
                            <p-calendar id="endDate" formControlName="endDate" dateFormat="yy-mm-dd" placeholder="YYYY-MM-DD" class="w-full"></p-calendar>
                        </div>
                    </div>
                    <div class="mt-6">
                        <p-button label="Load Visualization" icon="pi pi-chart-bar" (click)="loadVisualization()" styleClass="p-button-primary"></p-button>
                    </div>
                </form>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" *ngIf="chartData">
                <div class="bg-white shadow-md rounded-lg p-6">
                    <h3 class="text-xl font-semibold mb-4">Visits by Month</h3>
                    <p-chart type="bar" [data]="chartData.visitsByMonth" [options]="chartOptions" class="h-64"></p-chart>
                </div>
                <div class="bg-white shadow-md rounded-lg p-6">
                    <h3 class="text-xl font-semibold mb-4">Diagnosis Distribution</h3>
                    <p-chart type="bar" [data]="chartData.diagnosis" [options]="chartOptions" class="h-64"></p-chart>
                </div>
                <div class="bg-white shadow-md rounded-lg p-6">
                    <h3 class="text-xl font-semibold mb-4">Sex Distribution</h3>
                    <p-chart type="pie" [data]="chartData.sex" [options]="chartOptions" class="h-64"></p-chart>
                </div>
                <div class="bg-white shadow-md rounded-lg p-6">
                    <h3 class="text-xl font-semibold mb-4">Age Distribution</h3>
                    <p-chart type="bar" [data]="chartData.age" [options]="chartOptions" class="h-64"></p-chart>
                </div>
                <div class="bg-white shadow-md rounded-lg p-6">
                    <h3 class="text-xl font-semibold mb-4">City Distribution</h3>
                    <p-chart type="bar" [data]="chartData.city" [options]="chartOptions" class="h-64"></p-chart>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .p-calendar input:focus,
            .p-dropdown:focus {
                outline: none;
            }
        `
    ],
    providers: [MessageService]
})
export class VisualAnalyticsComponent implements OnInit {
    filterForm: FormGroup;
    chartData: any = null;
    chartOptions: any;

    constructor(
        private fb: FormBuilder,
        private reportService: ReportService,
        private messageService: MessageService
    ) {
        this.filterForm = this.fb.group({
            reportType: ['patient_visits', Validators.required],
            startDate: [''],
            endDate: [''],
            patientType: ['']
        });
        this.chartOptions = {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            }
        };
    }

    ngOnInit(): void {}

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
            patientType: formValue.patientType || undefined,
            patientSex: undefined,
            ageRange: undefined,
            city: undefined,
            state: undefined,
            allergies: undefined,
            medications: undefined
        };
        console.log('Sending request:', request);
        return request;
    }

    loadVisualization(): void {
        if (this.filterForm.invalid) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select a report type' });
            return;
        }

        const request: ReportRequest = this.formatRequest(this.filterForm.value);
        this.reportService.getVisualizationData(request).subscribe({
            next: (data: VisualizationData) => {
                this.chartData = {
                    visitsByMonth: {
                        labels: data.visits_by_month_labels,
                        datasets: [{ label: 'Visits', data: data.visits_by_month_values, backgroundColor: '#3B82F6' }]
                    },
                    diagnosis: {
                        labels: data.diagnosis_labels,
                        datasets: [{ label: 'Diagnoses', data: data.diagnosis_values, backgroundColor: '#10B981' }]
                    },
                    sex: {
                        labels: data.sex_labels,
                        datasets: [{ label: 'Sex Distribution', data: data.sex_values, backgroundColor: '#F59E0B' }]
                    },
                    age: {
                        labels: data.age_labels,
                        datasets: [{ label: 'Age Distribution', data: data.age_values, backgroundColor: '#EF4444' }]
                    },
                    city: {
                        labels: data.city_labels,
                        datasets: [{ label: 'City Distribution', data: data.city_values, backgroundColor: '#8B5CF6' }]
                    }
                };
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Visualization data loaded' });
            },
            error: (error: Error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
            }
        });
    }
}
