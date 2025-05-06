import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { PatientService, RiskAssessment, PatientRecord } from '../service/patient.service';

@Component({
    selector: 'app-risk-assessment',
    standalone: true,
    imports: [CommonModule, CardModule, ChartModule],
    template: `
    <div class="grid space-y-4">
        <div class="col-12 md:col-6">
            <p-card header="Patient Profile" *ngIf="patient">
                <div><b>Name:</b> {{patient.patientName}}</div>
                <div><b>DOB:</b> {{patient.patientDob}}</div>
                <div><b>Sex:</b> {{patient.patientSex}}</div>
                <div><b>City:</b> {{patient.city}}</div>
                <div><b>Phone:</b> {{patient.patientPhone}}</div>
            </p-card>
        </div>
        <div class="col-12 md:col-6">
            <p-card header="Risk Assessment" *ngIf="risk">
                <div><b>Risk Level:</b> <span [ngClass]="riskLevelClass(risk.riskLevel)">{{risk.riskLevel}}</span></div>
                <div><b>Reason:</b> {{risk.riskReason}}</div>
            </p-card>
        </div>
        <div class="col-12 md:col-6">
            <p-card header="Predictive Metrics" *ngIf="metricsChartData">
                <p-chart type="bar" [data]="metricsChartData"></p-chart>
            </p-card>
        </div>
        <div class="col-12 md:col-6">
            <p-card header="Intervention Recommendation" *ngIf="risk">
                <div *ngIf="risk.riskLevel.trim().toLowerCase() === 'high'">
                    <b>Recommendation:</b> Immediate clinical intervention and lifestyle counseling.
                </div>
                <div *ngIf="risk.riskLevel.trim().toLowerCase() === 'moderate'">
                    <b>Recommendation:</b> Monitor closely and suggest preventive measures.
                </div>
                <div *ngIf="risk.riskLevel.trim().toLowerCase() === 'low'">
                    <b>Recommendation:</b> Maintain current health plan and regular checkups.
                </div>
            </p-card>
        </div>
    </div>
    <p *ngIf="!risk">Loading risk assessment...</p>
    `,
    styles: [`.high-risk { color: #e53935; font-weight: bold; } .low-risk { color: #43a047; font-weight: bold; } .moderate-risk { color: #fbc02d; font-weight: bold; }`]
})
export class RiskAssessmentComponent implements OnInit {
    risk?: RiskAssessment;
    patient?: PatientRecord;
    metricsChartData: any;
    constructor(private route: ActivatedRoute, private patientService: PatientService) {}

    ngOnInit() {
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
                }
            });
        }
    }

    buildMetricsChart(patient: PatientRecord) {
        // Extract metrics from lbfData (e.g., LBF101: glucose, LBF102: hemoglobin, LBF103: blood pressure)
        const glucose = this.extractLbf(patient.lbfData, 'LBF101');
        const hemoglobin = this.extractLbf(patient.lbfData, 'LBF102');
        const bp = this.extractLbf(patient.lbfData, 'LBF103');
        return {
            labels: ['Glucose', 'Hemoglobin', 'Blood Pressure (Systolic)', 'Blood Pressure (Diastolic)'],
            datasets: [{
                label: 'Metrics',
                backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC'],
                data: [glucose, hemoglobin, bp.systolic, bp.diastolic]
            }]
        };
    }

    extractLbf(lbfData: string[], code: string): any {
        const entry = lbfData?.find(l => l.startsWith(code + ':'));
        if (!entry) return code === 'LBF103' ? { systolic: 0, diastolic: 0 } : '';
        const value = entry.split(':')[1];
        if (code === 'LBF103') {
            // Blood pressure format: systolic/diastolic
            const [systolic, diastolic] = value.split('/').map(Number);
            return { systolic, diastolic };
        }
        return parseFloat(value);
    }

    riskLevelClass(level?: string) {
        if (!level) return 'moderate-risk';
        const normalizedLevel = level.trim().toLowerCase();
        if (normalizedLevel === 'high') return 'high-risk';
        if (normalizedLevel === 'low') return 'low-risk';
        return 'moderate-risk';
    }
}
