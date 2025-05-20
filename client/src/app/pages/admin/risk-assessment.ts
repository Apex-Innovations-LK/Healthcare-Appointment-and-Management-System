import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PatientService, RiskAssessment, PatientRecord, ClinicalRecommendation } from './service/patient.service';

@Component({
    selector: 'app-risk-assessment',
    standalone: true,
    imports: [
        CommonModule, 
        FormsModule,
        CardModule, 
        ChartModule, 
        ProgressBarModule, 
        ButtonModule, 
        TooltipModule, 
        DividerModule, 
        TabViewModule,
        TableModule,
        ToastModule
    ],
    providers: [MessageService],
    template: `
    <p-toast></p-toast>
    <div class="grid space-y-4">
        <div class="col-12">
            <div class="flex-col align-items-center mb-3">
            <button pButton label="Back to Patients" icon="pi pi-arrow-left" class="p-button-outlined" (click)="navigateBack()"></button>
                <h2>Patient Risk Assessment</h2>
            </div>
        </div>
    
        <!-- Patient Overview -->
        <div class="col-12 md:col-5 lg:col-4">
            <p-card styleClass="h-full border-round-lg shadow-1">
                <ng-template pTemplate="header">
                    <div class="pt-6 pl-6" style="border-radius: 12px 12px 0 0;">
                        <h3 class="m-0 text-black">Patient Profile</h3>
                    </div>
                </ng-template>
                
                <div *ngIf="patient">
                    <div class="flex mb-4">
                        <div class="flex justify-content-center align-items-center bg-primary-100 border-round" style="width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <i class="pi pi-user text-black text-2xl"></i>
                        </div>
                        <div class="ml-3">
                            <h4 class="mt-0 mb-1">{{patient.patientName}}</h4>
                            <p class="text-500 m-0">Patient ID: {{patient.patientId}}</p>
                        </div>
                    </div>

                    <div class="grid">
                        <div class="col-6">
                            <div class="mb-3">
                                <label class="block text-500 font-medium mb-1">Date of Birth</label>
                                <div>{{patient.patientDob}}</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="mb-3">
                                <label class="block text-500 font-medium mb-1">Sex</label>
                                <div>{{patient.patientSex}}</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="mb-3">
                                <label class="block text-500 font-medium mb-1">City</label>
                                <div>{{patient.city}}</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="mb-3">
                                <label class="block text-500 font-medium mb-1">Phone</label>
                                <div>{{patient.patientPhone}}</div>
                            </div>
                        </div>
                    </div>
                    
                    <p-divider></p-divider>
                    
                    <div class="mb-3">
                        <label class="block text-500 font-medium mb-1">Referring Doctor</label>
                        <div>{{patient.referringDoctor}}</div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="block text-500 font-medium mb-1">Chief Complaint</label>
                        <ul class="pl-3 mt-1 mb-0">
                            <li *ngFor="let complaint of patient.chiefComplaint">{{complaint}}</li>
                        </ul>
                    </div>
                    
                    <p-divider></p-divider>
                    
                    <div class="mb-3">
                        <label class="block text-500 font-medium mb-1">Allergies</label>
                        <div class="flex flex-wrap gap-2 mt-1">
                            <span 
                                *ngFor="let allergy of patient.allergies"
                                class="inline-flex align-items-center px-2 py-1 text-xs font-medium rounded-pill text-red-800 bg-red-50"
                            >
                                {{allergy}}
                            </span>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="block text-500 font-medium mb-1">Medications</label>
                        <div class="flex flex-wrap gap-2 mt-1">
                            <span 
                                *ngFor="let medication of patient.medications"
                                class="inline-flex align-items-center px-2 py-1 text-xs font-medium rounded-pill text-green-800 bg-green-50"
                            >
                                {{medication}}
                            </span>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="block text-500 font-medium mb-1">Problem List</label>
                        <div *ngIf="patient.problemList && patient.problemList.length > 0">
                            <div class="flex flex-wrap gap-2 mt-1">
                                <span 
                                    *ngFor="let problem of patient.problemList"
                                    class="inline-flex align-items-center px-2 py-1 text-xs font-medium rounded-pill text-blue-800 bg-blue-50"
                                >
                                    {{problem}}
                                </span>
                            </div>
                        </div>
                        <div *ngIf="!patient.problemList || patient.problemList.length === 0" class="mt-1">
                            <span class="text-500">No active problems recorded</span>
                        </div>
                    </div>
                </div>
                
                <div *ngIf="!patient" class="flex justify-content-center align-items-center" style="height: 300px">
                    <i class="pi pi-spin pi-spinner text-primary text-4xl"></i>
                </div>
            </p-card>
        </div>
        
        <!-- Risk Assessment -->
        <div class="col-12 md:col-7 lg:col-8">
            <div class="grid">
                <!-- Risk Score Card -->
                <div class="col-12">
                    <p-card *ngIf="risk" styleClass="border-round-lg shadow-1">
                        <ng-template pTemplate="header">
                            <div class="p-6 flex justify-between align-items-center"
                                 [ngClass]="{'bg-red-50 text-red-800': isHighRisk(), 'bg-yellow-50 text-yellow-900': isModerateRisk(), 'bg-green-50 text-green-800': isLowRisk()}"
                                 style="border-radius: 12px 12px 0 0;"
                            >
                                <div>
                                    <h3 class="m-0">Risk Assessment</h3>
                                    <p class="m-0 opacity-8">Based on SciPy advanced statistical analysis</p>
                                </div>
                                <div class="flex bg-white p-3 border-round items-center">
                                    <h2 class="m-0 font-bold mr-4" [ngClass]="{'text-red-500': isHighRisk(), 'text-yellow-500': isModerateRisk(), 'text-green-500': isLowRisk()}">
                                        {{(risk.riskProbability * 100).toFixed(0)}}%
                                    </h2>
                                    <span>Probability</span>
                                </div>
                            </div>
                        </ng-template>
                        
                        <div class="grid">
                            <div class="col-12 lg:col-6">
                                <div class="mb-4">
                                    <h4 class="mb-3">Risk Level</h4>
                                    <div class="flex align-items-center">
                                        <i [ngClass]="riskIcon()" class="mr-2 text-xl" 
                                           [ngStyle]="{'color': riskTextColor()}"></i>
                                        <span [ngStyle]="{'color': riskTextColor(), 'font-weight': 'bold', 'font-size': '1.2rem'}">
                                            {{risk.riskLevel}}
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="mb-4">
                                    <h4 class="mb-3">Primary Risk Factor</h4>
                                    <p>{{risk.riskReason}}</p>
                                </div>
                                
                                <div class="mb-4">
                                    <h4 class="mb-3">Risk Assessment Score</h4>
                                    <p-progressBar [value]="risk.riskProbability * 100" [showValue]="false" 
                                        [style]="{'height': '8px', 'border-radius': '4px'}" 
                                        [styleClass]="riskProbabilityClass(risk.riskProbability)">
                                    </p-progressBar>
                                    <div class="flex justify-between mt-2">
                                        <span class="text-500">Low Risk</span>
                                        <span class="text-500">Moderate Risk</span>
                                        <span class="text-500">High Risk</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-12 lg:col-6">
                                <h4>Recommended Actions</h4>
                                <div *ngIf="isHighRisk()">
                                    <ul class="pl-3 mb-3">
                                        <li class="mb-2">Schedule immediate follow-up within 1-2 weeks</li>
                                        <li class="mb-2">Consider specialist referral based on risk factors</li>
                                        <li class="mb-2">Implement daily monitoring protocol</li>
                                        <li class="mb-2">Review current medication regimen</li>
                                    </ul>
                                </div>
                                
                                <div *ngIf="isModerateRisk()" class="mb-3">
                                    <ul class="pl-3 mb-3">
                                        <li class="mb-2">Schedule follow-up within 1 month</li>
                                        <li class="mb-2">Provide lifestyle modification guidance</li>
                                        <li class="mb-2">Review risk factors at next visit</li>
                                    </ul>
                                </div>
                                
                                <div *ngIf="isLowRisk()">
                                    <ul class="pl-3 mb-3">
                                        <li class="mb-2">Continue routine annual examinations</li>
                                        <li class="mb-2">Maintain current health practices</li>
                                        <li class="mb-2">No additional intervention required</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </p-card>
                    
                    <div *ngIf="!risk" class="flex justify-content-center align-items-center p-5">
                        <i class="pi pi-spin pi-spinner text-primary text-4xl mr-3"></i>
                        <span>Loading risk assessment...</span>
                    </div>
                </div>
                
                <!-- Health Metrics Analysis -->
                <div class="col-12 mt-4">
                    <p-tabView>
                        <p-tabPanel header="Health Metrics">
                            <div class="grid rounded-md">
                                <div class="col-12 lg:col-6" *ngIf="metricsChartData">
                                    <h4>Health Metrics Analysis</h4>
                                    <p-chart type="bar" [data]="metricsChartData" [options]="chartOptions"></p-chart>
                                    <div class="text-center mt-2">
                                        <small class="text-500">Comparison with reference values</small>
                                    </div>
                                </div>
                                
                                <div class="col-12 lg:col-6" *ngIf="zScoreChartData">
                                    <h4>Z-Score Analysis</h4>
                                    <div style="max-width: 600px; margin: 0 auto;">
                                        <p-chart type="radar" [data]="zScoreChartData" [options]="radarOptions"></p-chart>
                                    </div>
                                    <div class="text-center mt-2">
                                        <small class="text-500">Statistical deviation from population norms</small>
                                    </div>
                                </div>
                            </div>
                        </p-tabPanel>

                        <!-- Clinical Recommendations Tab -->
                        <p-tabPanel header="Clinical Guidelines">
                            <div class="grid">
                                <div class="col-12">
                                    <div class="flex justify-content-between align-items-center mb-3">
                                        <h4>Clinical Recommendations</h4>
                                    </div>
                                    
                                    <div *ngIf="loadingRecommendations" class="flex justify-content-center align-items-center p-5">
                                        <i class="pi pi-spin pi-spinner text-primary text-4xl mr-3"></i>
                                        <span>Loading clinical recommendations...</span>
                                    </div>
                                    
                                    <p-table *ngIf="!loadingRecommendations" [value]="recommendations" styleClass="p-datatable-sm">
                                        <ng-template pTemplate="header">
                                            <tr>
                                                <th>Condition</th>
                                                <th>Recommendation</th>
                                                <th>Source</th>
                                            </tr>
                                        </ng-template>
                                        <ng-template pTemplate="body" let-recommendation>
                                            <tr>
                                                <td>{{recommendation.condition}}</td>
                                                <td>{{recommendation.recommendation}}</td>
                                                <td>{{recommendation.source}}</td>
                                            </tr>
                                        </ng-template>
                                        <ng-template pTemplate="emptymessage">
                                            <tr>
                                                <td colspan="3" class="text-center p-4">
                                                    <div class="flex flex-column align-items-center">
                                                        <i class="pi pi-info-circle text-blue-500 text-3xl mb-3"></i>
                                                        <span>No clinical recommendations available</span>
                                                        <button pButton label="Load Recommendations" 
                                                                class="p-button-text p-button-sm mt-2"
                                                                (click)="loadRecommendations()"></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </ng-template>
                                    </p-table>
                                </div>
                            </div>
                        </p-tabPanel>
                    </p-tabView>
                </div>
            </div>
        </div>
    </div>
    `,
    styles: [`
        .high-risk { color: #e53935; font-weight: bold; } 
        .low-risk { color: #43a047; font-weight: bold; } 
        .moderate-risk { color: #fbc02d; font-weight: bold; }
        .probability-high { background: linear-gradient(90deg, #ffcdd2 0%, #e53935 100%); }
        .probability-moderate { background: linear-gradient(90deg, #fff9c4 0%, #fbc02d 100%); }
        .probability-low { background: linear-gradient(90deg, #c8e6c9 0%, #43a047 100%); }
        
        .p-tag-danger {
            background-color: #f44336;
            color: #ffffff;
        }
        
        .p-tag-warning {
            background-color: #ff9800;
            color: #ffffff;
        }
        
        .p-tag-info {
            background-color: #2196f3;
            color: #ffffff;
        }
        
        .p-tag {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
            font-weight: 700;
            line-height: 1;
            text-align: center;
            white-space: nowrap;
            vertical-align: baseline;
            border-radius: 0.25rem;
        }
    `]
})
export class RiskAssessmentComponent implements OnInit {
    risk?: RiskAssessment;
    patient?: PatientRecord;
    metricsChartData: any;
    zScoreChartData: any;
    chartOptions: any;
    radarOptions: any;
    
    // Clinical guideline properties
    recommendations: ClinicalRecommendation[] = [];
    loadingRecommendations = false;
    
    constructor(
        private route: ActivatedRoute, 
        private patientService: PatientService,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.initChartOptions();
        
        const patientId = this.route.snapshot.paramMap.get('id');
        if (patientId) {
            this.patientService.getRiskAssessment(patientId).subscribe((data: RiskAssessment) => {
                console.log('Risk assessment response:', data);
                this.risk = data;
            });
            
            this.patientService.getAllPatients().subscribe((patients: PatientRecord[]) => {
                this.patient = patients.find(p => String(p.patientId) === String(patientId));
                if (this.patient) {
                    this.metricsChartData = this.buildMetricsChart(this.patient);
                    this.zScoreChartData = this.buildZScoreChart(this.patient);
                    
                    // Automatically load clinical recommendations
                    this.loadRecommendations();
                }
            });
        }
    }
    
    loadRecommendations() {
        if (!this.patient) return;
        
        this.loadingRecommendations = true;
        
        // Convert PatientRecord to the format expected by the API
        const patientData = {
            patient_id: this.patient.patientId,
            patient_name: this.patient.patientName,
            patient_dob: this.patient.patientDob,
            patient_sex: this.patient.patientSex,
            chief_complaint: this.patient.chiefComplaint,
            allergies: this.patient.allergies,
            medications: this.patient.medications,
            problem_list: this.patient.problemList,
            lbf_data: this.patient.lbfData,
            his_data: this.patient.hisData
        };
        
        this.patientService.evaluatePatient(patientData).subscribe({
            next: (recommendations) => {
                this.recommendations = recommendations;
                this.loadingRecommendations = false;
            },
            error: (error) => {
                console.error('Error loading recommendations:', error);
                this.loadingRecommendations = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load recommendations. Please try again later.',
                    life: 5000
                });
                
                // Provide fallback recommendations based on patient data
                this.recommendations = this.getFallbackRecommendations();
            }
        });
    }
    
    getFallbackRecommendations(): ClinicalRecommendation[] {
        if (!this.patient) return [];
        
        const fallbackRecs: ClinicalRecommendation[] = [];
        
        // Example logic for generating fallback recommendations based on patient data
        if (this.isHighRisk()) {
            fallbackRecs.push({
                condition: 'High Risk Patient',
                recommendation: 'Schedule follow-up within 2 weeks',
                source: 'System Default'
            });
        }
        
        // Check for common medications and provide recommendations
        if (this.patient.medications?.includes('aspirin')) {
            fallbackRecs.push({
                condition: 'Aspirin Therapy',
                recommendation: 'Monitor for GI bleeding, consider proton pump inhibitor',
                source: 'Standard Guidelines'
            });
        }
        
        // Check for common problems and provide recommendations
        if (this.patient.problemList?.some(problem => problem.toLowerCase().includes('diabetes'))) {
            fallbackRecs.push({
                condition: 'Diabetes Management',
                recommendation: 'HbA1c testing every 3-6 months, annual eye and foot exams',
                source: 'ADA Guidelines'
            });
        }
        
        return fallbackRecs;
    }
    
    
    
    navigateBack() {
        this.router.navigate(['/admin/patients']);
    }

    initChartOptions() {
        this.chartOptions = {
            indexAxis: 'y',
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context: any) {
                            return context.dataset.label + ': ' + context.raw;
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'bottom'
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        color: 'rgba(0,0,0,0.7)'
                    }
                },
                y: {
                    ticks: {
                        color: 'rgba(0,0,0,0.7)'
                    }
                }
            }
        };
        
        this.radarOptions = {
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context: any) {
                            return context.dataset.label + ': ' + context.raw;
                        }
                    }
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: -3,
                    suggestedMax: 3,
                    ticks: {
                        stepSize: 1
                    },
                    pointLabels: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        };
    }

    buildMetricsChart(patient: PatientRecord) {
        // Extract metrics from lbfData
        const glucose = this.extractLbf(patient.lbfData, 'LBF101');
        const hemoglobin = this.extractLbf(patient.lbfData, 'LBF102');
        const bp = this.extractLbf(patient.lbfData, 'LBF103');
        
        // Reference values based on medical standards
        const glucoseRef = 5.2;  // Normal fasting glucose
        const hemoglobinRef = 14.0; // Normal hemoglobin
        const systolicRef = 120;  // Normal systolic BP
        const diastolicRef = 80;  // Normal diastolic BP
        
        return {
            labels: ['Glucose', 'Hemoglobin', 'Systolic BP', 'Diastolic BP'],
            datasets: [
                {
                    label: 'Patient Metrics',
                    backgroundColor: '#42A5F5',
                    data: [glucose, hemoglobin, bp.systolic, bp.diastolic]
                },
                {
                    label: 'Reference Values',
                    backgroundColor: '#78909C',
                    data: [glucoseRef, hemoglobinRef, systolicRef, diastolicRef]
                }
            ]
        };
    }
    
    buildZScoreChart(patient: PatientRecord) {
        // Extract metrics
        const glucose = this.extractLbf(patient.lbfData, 'LBF101');
        const hemoglobin = this.extractLbf(patient.lbfData, 'LBF102');
        const bp = this.extractLbf(patient.lbfData, 'LBF103');
        
        // Population means and standard deviations (from our SciPy analysis)
        const glucose_mean = 5.2, glucose_std = 0.8;
        const hemoglobin_mean = 14.0, hemoglobin_std = 1.5;
        const systolic_mean = 120, systolic_std = 10;
        const diastolic_mean = 80, diastolic_std = 8;
        
        // Calculate z-scores
        const glucoseZScore = (glucose - glucose_mean) / glucose_std;
        const hemoglobinZScore = (hemoglobin - hemoglobin_mean) / hemoglobin_std;
        const systolicZScore = (bp.systolic - systolic_mean) / systolic_std;
        const diastolicZScore = (bp.diastolic - diastolic_mean) / diastolic_std;
        
        return {
            labels: ['Glucose', 'Hemoglobin', 'Systolic BP', 'Diastolic BP'],
            datasets: [
                {
                    label: 'Z-Score (Deviation from Normal)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    data: [
                        Number(glucoseZScore.toFixed(2)),
                        Number(hemoglobinZScore.toFixed(2)),
                        Number(systolicZScore.toFixed(2)),
                        Number(diastolicZScore.toFixed(2))
                    ]
                },
                {
                    label: 'Normal Range',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    borderDash: [5, 5],
                    data: [0, 0, 0, 0]
                }
            ]
        };
    }

    extractLbf(lbfData: string[], code: string): any {
        const entry = lbfData?.find(l => l.startsWith(code + ':'));
        if (!entry) return code === 'LBF103' ? { systolic: 0, diastolic: 0 } : 0;
        const value = entry.split(':')[1];
        if (code === 'LBF103') {
            // Blood pressure format: systolic/diastolic
            const [systolic, diastolic] = value.split('/').map(Number);
            return { systolic, diastolic };
        }
        return parseFloat(value) || 0;
    }

    isHighRisk(): boolean {
        if (!this.risk) return false;
        return this.risk.riskLevel.trim().toLowerCase() === 'high';
    }
    
    isModerateRisk(): boolean {
        if (!this.risk) return false;
        return this.risk.riskLevel.trim().toLowerCase() === 'moderate';
    }
    
    isLowRisk(): boolean {
        if (!this.risk) return false;
        return this.risk.riskLevel.trim().toLowerCase() === 'low';
    }
    
    riskIcon(): string {
        if (this.isHighRisk()) return 'pi pi-exclamation-circle';
        if (this.isModerateRisk()) return 'pi pi-exclamation-triangle';
        return 'pi pi-check-circle';
    }
    
    riskTextColor(): string {
        if (this.isHighRisk()) return '#e53935';
        if (this.isModerateRisk()) return '#fbc02d';
        return '#43a047';
    }
    
    riskLevelClass(level?: string) {
        if (!level) return 'moderate-risk';
        const normalizedLevel = level.trim().toLowerCase();
        if (normalizedLevel === 'high') return 'high-risk';
        if (normalizedLevel === 'low') return 'low-risk';
        return 'moderate-risk';
    }
    
    riskProbabilityClass(probability: number) {
        if (probability >= 0.7) return 'probability-high';
        if (probability >= 0.3) return 'probability-moderate';
        return 'probability-low';
    }
}
