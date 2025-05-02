import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PatientService, PatientRecord } from './service/patient.service';

@Component({
    selector: 'app-patient-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule],
    template: `
    <div class="card">
        <h2>Patient List</h2>
        <p-table [value]="patients" [paginator]="true" [rows]="10" *ngIf="patients">
            <ng-template pTemplate="header">
                <tr>
                    <th>Name</th>
                    <th>DOB</th>
                    <th>Sex</th>
                    <th>City</th>
                    <th>Phone</th>
                    <th>Actions</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-patient>
                <tr>
                    <td>{{patient.patientName}}</td>
                    <td>{{patient.patientDob}}</td>
                    <td>{{patient.patientSex}}</td>
                    <td>{{patient.city}}</td>
                    <td>{{patient.patientPhone}}</td>
                    <td>
                        <button pButton type="button" label="Risk Assessment" icon="pi pi-chart-line" (click)="viewRisk(patient)"></button>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    </div>
    `
})
export class PatientListComponent implements OnInit {
    patients: PatientRecord[] = [];
    constructor(private patientService: PatientService, private router: Router) {}

    ngOnInit() {
        this.patientService.getAllPatients().subscribe((data: PatientRecord[]) => this.patients = data);
    }

    viewRisk(patient: PatientRecord) {
        this.router.navigate(['/pages/risk-assessment', patient.patientId]);
    }
}
