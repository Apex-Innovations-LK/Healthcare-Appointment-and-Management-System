import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { PatientService, PatientRecord } from './service/patient.service';

@Component({
    selector: 'app-patient-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, CardModule, InputTextModule, TooltipModule, BadgeModule],
    template: `
    <div class="grid">
        <div class="col-12">
            <div class="flex justify-content-between align-items-center mb-3">
                <h2>Patients</h2>
            </div>
        </div>
        
        <div class="col-12">
            <p-card styleClass="mb-0">
                <div class="flex justify-content-between align-items-center mb-3">
                    <div class="flex align-items-center">
                        <span class="p-input-icon-left mr-3">
                            <i class="pi pi-search pr-4"></i>
                            <input 
                                pInputText 
                                type="text" 
                                placeholder="Search patients..." 
                                style="width: 300px"
                                (input)="applyFilter($event)"
                            />
                        </span>
                    </div>
                </div>
                
                <p-table 
                    [value]="filteredPatients" 
                    [paginator]="true" 
                    [rows]="10"
                    [rowsPerPageOptions]="[5, 10, 25, 50]"
                    [sortField]="'patientName'"
                    styleClass="p-datatable-sm"
                    responsiveLayout="scroll"
                    [loading]="loading"
                >
                    <ng-template pTemplate="header">
                        <tr>
                            <th pSortableColumn="patientId" style="width: 100px">ID <p-sortIcon field="patientId"></p-sortIcon></th>
                            <th pSortableColumn="patientName" style="min-width: 150px">Name <p-sortIcon field="patientName"></p-sortIcon></th>
                            <th pSortableColumn="patientDob">DOB <p-sortIcon field="patientDob"></p-sortIcon></th>
                            <th pSortableColumn="patientSex">Sex <p-sortIcon field="patientSex"></p-sortIcon></th>
                            <th style="width: 150px">Actions</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-patient>
                        <tr>
                            <td>{{patient.patientId}}</td>
                            <td>
                                <div class="flex align-items-center">
                                    <span class="font-semibold">{{patient.patientName}}</span>
                                </div>
                            </td>
                            <td>{{patient.patientDob}}</td>
                            <td>{{patient.patientSex}}</td>
                            <td>
                                <div class="flex">
                                    <button 
                                        pButton 
                                        type="button" 
                                        icon="pi pi-chart-bar"
                                        class="p-button" 
                                        (click)="viewRisk(patient)"
                                    >Assess Risk</button>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="5" class="text-center p-4">
                                <div class="flex flex-column align-items-center">
                                    <i class="pi pi-search text-3xl text-500 mb-3"></i>
                                    <span>No patients found</span>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </p-card>
        </div>
    </div>
    `,
    styles: [`
        .risk-high { background-color: #ffcdd2; color: #c62828; }
        .risk-moderate { background-color: #fff9c4; color: #f57f17; }
        .risk-low { background-color: #c8e6c9; color: #2e7d32; }
        
        .risk-color-high { background-color: #f44336; }
        .risk-color-moderate { background-color: #fbc02d; }
        .risk-color-low { background-color: #4caf50; }
    `]
})
export class PatientListComponent implements OnInit {
    patients: PatientRecord[] = [];
    filteredPatients: PatientRecord[] = [];
    loading: boolean = true;
    
    constructor(
        private patientService: PatientService, 
        private router: Router
    ) {}

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading = true;
        
        // Only load patient data, not risk assessments
        this.patientService.getAllPatients().subscribe(patients => {
            this.patients = patients;
            this.filteredPatients = [...this.patients];
            this.loading = false;
        });
    }
    
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
        
        this.filteredPatients = this.patients.filter(patient => {
            return (
                patient.patientName.toLowerCase().includes(filterValue) ||
                patient.city?.toLowerCase().includes(filterValue) ||
                patient.patientDob?.toLowerCase().includes(filterValue)
            );
        });
    }

    viewRisk(patient: PatientRecord) {
        this.router.navigate(['/admin/risk-assessment', patient.patientId]);
    }
    
    navigateToDashboard() {
        this.router.navigate(['/admin']);
    }
}
