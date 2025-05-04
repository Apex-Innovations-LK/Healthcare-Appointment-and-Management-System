import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableModule, Table, TableRowSelectEvent } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Models
export interface PatientData {
  record_id: string;
  patient_id: string;
  patient_name: string;
  patient_dob: string;
  date_of_service: string;
  referring_doctor: string;
  chief_complaint: string[];
  allergies: string[];
  medications: string[];
  problem_list: string[];
  patient_sex: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  patient_phone: string;
  lbf_data: string[];
  his_data: string[];
}

export interface ClinicalRecommendation {
    condition: string;
    recommendation: string;
    source: string;
}

export interface DrugInteraction {
  drugA: string;
  drugB: string;
  severity: string;
  description: string;
}

// Service (unchanged)
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_BASE_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAllPatients(): Observable<PatientData[]> {
    return this.http.get<PatientData[]>(`${this.API_BASE_URL}/guidelines/raw/patients`);
  }

  evaluatePatient(patient: PatientData): Observable<ClinicalRecommendation[]> {
    return this.http.post<ClinicalRecommendation[]>(`${this.API_BASE_URL}/guidelines/evaluate`, patient);
  }

  checkDrugInteractions(medications: string[]): Observable<DrugInteraction[]> {
    return this.http.post<DrugInteraction[]>(`${this.API_BASE_URL}/medication/check`, medications);
  }
}

// Component
@Component({
  selector: 'app-guidelines',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CardModule,
    AccordionModule,
    MultiSelectModule,
    ButtonModule,
    ProgressSpinnerModule,
    MessageModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast position="top-right"></p-toast>
    <div class="bg-surface-50 dark:bg-surface-950 flex flex-col min-h-screen min-w-[100vw] overflow-hidden p-4">
      <p-progressSpinner *ngIf="loading" styleClass="w-12 h-12" strokeWidth="4" animationDuration="1s"></p-progressSpinner>
      <div class="flex flex-col items-center justify-center w-full">
        <div class="w-full bg-surface-0 dark:bg-surface-900 p-6 sm:p-8 rounded-3xl shadow-md">
          <!-- Patient List -->
          <p-table
            #dt
            [value]="patients"
            [paginator]="true"
            [rows]="10"
            [showCurrentPageReport]="true"
            [tableStyle]="{'min-width': '50rem'}"
            (onRowSelect)="onPatientSelect($event)"
            selectionMode="single"
            dataKey="patient_id"
            [globalFilterFields]="['patient_id', 'patient_name', 'patient_dob', 'patient_sex', 'city']"
            class="mb-8"
          >
            <ng-template pTemplate="caption">
              <div class="flex justify-between items-center">
                <h2 class="text-surface-900 dark:text-surface-0 text-2xl font-bold">Patients</h2>
                <span class="p-input-icon-left">
                  <i class="pi pi-search"></i>
                  <input
                    pInputText
                    type="text"
                    (input)="onSearch($event)"
                    placeholder="Search"
                    class="p-2 rounded-md"
                  />
                </span>
              </div>
            </ng-template>
            <ng-template pTemplate="header">
              <tr>
                <th pSortableColumn="patient_id" class="p-4">ID <p-sortIcon field="patient_id"></p-sortIcon></th>
                <th pSortableColumn="patient_name" class="p-4">Name <p-sortIcon field="patient_name"></p-sortIcon></th>
                <th pSortableColumn="patient_dob" class="p-4">DOB <p-sortIcon field="patient_dob"></p-sortIcon></th>
                <th pSortableColumn="patient_sex" class="p-4">Sex <p-sortIcon field="patient_sex"></p-sortIcon></th>
                <th pSortableColumn="city" class="p-4">City <p-sortIcon field="city"></p-sortIcon></th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-patient>
              <tr [pSelectableRow]="patient" class="hover:bg-surface-100 dark:hover:bg-surface-800">
                <td class="p-4">{{ patient.patient_id }}</td>
                <td class="p-4">{{ patient.patient_name }}</td>
                <td class="p-4">{{ patient.patient_dob }}</td>
                <td class="p-4">{{ patient.patient_sex }}</td>
                <td class="p-4">{{ patient.city }}</td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="5" class="p-4 text-center">No patients found</td>
              </tr>
            </ng-template>
          </p-table>

          <!-- Patient Details and Medication Checker -->
          <div class="flex flex-col lg:flex-row gap-6" *ngIf="selectedPatient">
            <div class="flex-1">
              <p-card header="Patient Details" class="mb-6">
                <p-accordion>
                  <p-accordionTab header="Basic Info">
                    <div class="flex flex-col gap-2">
                      <p><strong>ID:</strong> {{ selectedPatient.patient_id }}</p>
                      <p><strong>Name:</strong> {{ selectedPatient.patient_name }}</p>
                      <p><strong>DOB:</strong> {{ selectedPatient.patient_dob }}</p>
                      <p><strong>Sex:</strong> {{ selectedPatient.patient_sex }}</p>
                      <p><strong>Address:</strong> {{ selectedPatient.address }}, {{ selectedPatient.city }}, {{ selectedPatient.state }} {{ selectedPatient.zip }}</p>
                      <p><strong>Phone:</strong> {{ selectedPatient.patient_phone }}</p>
                    </div>
                  </p-accordionTab>
                  <p-accordionTab header="Chief Complaint">
                    <ul class="list-disc pl-5">
                      <li *ngFor="let complaint of selectedPatient.chief_complaint">{{ complaint }}</li>
                    </ul>
                  </p-accordionTab>
                  <p-accordionTab header="Medications">
                    <ul class="list-disc pl-5">
                      <li *ngFor="let med of selectedPatient.medications">{{ med }}</li>
                    </ul>
                  </p-accordionTab>
                  <p-accordionTab header="Problem List">
                    <ul class="list-disc pl-5">
                      <li *ngFor="let problem of selectedPatient.problem_list">{{ problem }}</li>
                    </ul>
                  </p-accordionTab>
                  <p-accordionTab header="Allergies">
                    <ul class="list-disc pl-5">
                      <li *ngFor="let allergy of selectedPatient.allergies">{{ allergy }}</li>
                    </ul>
                  </p-accordionTab>
                </p-accordion>
              </p-card>

              <p-card header="Medication Interaction Checker">
                <p-multiSelect
                  [options]="medicationOptions"
                  [(ngModel)]="selectedMedications"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select Medications"
                  class="w-full mb-4"
                ></p-multiSelect>
                <p-button
                  label="Check Interactions"
                  icon="pi pi-check"
                  (click)="checkInteractions()"
                  severity="primary"
                  class="mb-4"
                  [disabled]="loading || selectedMedications.length < 2"
                ></p-button>
                <p-table
                  [value]="drugInteractions"
                  [tableStyle]="{'min-width': '30rem'}"
                  *ngIf="drugInteractions.length"
                >
                  <ng-template pTemplate="header">
                    <tr>
                      <th class="p-4">Drug A</th>
                      <th class="p-4">Drug B</th>
                      <th class="p-4">Severity</th>
                      <th class="p-4">Description</th>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="body" let-interaction>
                    <tr>
                      <td class="p-4">{{ interaction.drugA }}</td>
                      <td class="p-4">{{ interaction.drugB }}</td>
                      <td class="p-4">{{ interaction.severity }}</td>
                      <td class="p-4">{{ interaction.description }}</td>
                    </tr>
                  </ng-template>
                </p-table>
              </p-card>
            </div>

            <!-- Clinical Recommendations -->
            <div class="flex-1">
              <p-card header="Clinical Recommendations">
                    <p-table [value]="recommendations" [tableStyle]="{'min-width': '30rem'}">
                        <ng-template pTemplate="header">
                        <tr>
                            <th class="p-4">Condition</th>
                            <th class="p-4">Recommendation</th>
                            <th class="p-4">Source</th>
                        </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-recommendation>
                        <tr>
                            <td class="p-4">{{ recommendation.condition }}</td>
                            <td class="p-4">{{ recommendation.recommendation }}</td>
                            <td class="p-4">{{ recommendation.source }}</td>
                        </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="3" class="p-4 text-center">No recommendations available</td>
                        </tr>
                        </ng-template>
                    </p-table>
                </p-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    .p-table {
      background: transparent;
    }
    .p-table th, .p-table td {
      border: none;
    }
    .p-card {
      background: #ffffff;
      border-radius: 12px;
    }
    .dark .p-card {
      background: #1f2937;
    }
    @media (max-width: 768px) {
      .lg\\:flex-row {
        flex-direction: column;
      }
      .p-table {
        min-width: 100%;
      }
    }
  `]
})
export class Guidelines implements OnInit {
  @ViewChild('dt') dt!: Table;
  patients: PatientData[] = [];
  selectedPatient: PatientData | null = null;
  recommendations: ClinicalRecommendation[] = [];
  drugInteractions: DrugInteraction[] = [];
  selectedMedications: string[] = [];
  medicationOptions: { label: string, value: string }[] = [];
  predefinedMedications = [
    'aspirin', 'ibuprofen', 'naproxen', 'fluoxetine', 'sertraline',
    'sumatriptan', 'warfarin', 'ciprofloxacin', 'grapefruit', 'simvastatin',
    "st. john's wort", 'ritonavir'
  ];
  loading = false;

  constructor(private apiService: ApiService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadPatients();
    this.medicationOptions = this.predefinedMedications.map(med => ({
      label: med,
      value: med
    }));
  }

  loadPatients(): void {
    this.loading = true;
    this.apiService.getAllPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Patients loaded successfully' });
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.getErrorMessage(err) });
      }
    });
  }

  onPatientSelect(event: TableRowSelectEvent): void {
    const patient = event.data as PatientData | undefined;
    if (patient) {
      this.selectedPatient = patient;
      this.selectedMedications = patient.medications || [];
      this.medicationOptions = [
        ...new Set([
          ...(patient.medications || []),
          ...this.predefinedMedications
        ])
      ].map(med => ({ label: med, value: med }));
      this.loadRecommendations();
      this.drugInteractions = [];
    } else {
      this.clearSelection();
    }
  }

  loadRecommendations(): void {
    if (!this.selectedPatient) return;
    this.loading = true;
    this.apiService.evaluatePatient(this.selectedPatient).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        if (response.length === 0) {
          console.log('No recommendations from API, using fallback');
          this.recommendations = [
            {
              condition: 'No Data',
              recommendation: 'No recommendations available',
              source: 'API'
            }
          ];
        } else {
          this.recommendations = response.map((item: any) => ({
            condition: item.message, // Adjust based on actual API fields
            recommendation: item.name,
            source: item.description
          }));
        }
        console.log('Mapped Recommendations:', this.recommendations);
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Recommendations loaded successfully' });
      },
      error: (err) => {
        console.log('API Error:', err);
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.getErrorMessage(err) });
      }
    });
  }

  checkInteractions(): void {
    if (this.selectedMedications.length < 2) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please select at least two medications' });
      return;
    }
    this.loading = true;
    this.apiService.checkDrugInteractions(this.selectedMedications).subscribe({
      next: (interactions) => {
        this.drugInteractions = interactions;
        this.loading = false;
        this.messageService.add({ severity: 'info', summary: 'Check Complete', detail: 'Drug interactions evaluated successfully' });
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.getErrorMessage(err) });
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && this.dt) {
      this.dt.filterGlobal(input.value, 'contains');
    }
  }

  clearSelection(): void {
    this.selectedPatient = null;
    this.recommendations = [];
    this.drugInteractions = [];
    this.selectedMedications = [];
    this.medicationOptions = this.predefinedMedications.map(med => ({
      label: med,
      value: med
    }));
  }

  private getErrorMessage(err: any): string {
    if (err?.error?.message) {
      return err.error.message;
    } else if (err?.message) {
      return err.message;
    } else if (err?.status) {
      return `HTTP Error ${err.status}: ${err.statusText}`;
    }
    return 'An unexpected error occurred. Please try again later.';
  }
}