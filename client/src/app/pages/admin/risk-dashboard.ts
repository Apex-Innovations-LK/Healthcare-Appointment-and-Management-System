import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { PatientService, RiskAssessment } from '../service/patient.service';

@Component({
    selector: 'app-risk-dashboard',
    standalone: true,
    imports: [CommonModule, ChartModule, CardModule],
    template: `
    <div class="grid space-y-4">
        <div class="col-12 md:col-6 lg:col-4">
            <p-card header="Risk Distribution">
                <div style="height: 100%; width: 100%;">
                    <p-chart type="pie" [data]="riskChartData" [options]="pieOptions" style="height:100%; width:100%;"></p-chart>
                </div>
            </p-card>
        </div>
        <div class="col-12 md:col-6 lg:col-4">
            <p-card header="Summary">
                <div>Total Patients: <b>{{total}}</b></div>
                <div>High Risk: <b>{{high}}</b></div>
                <div>Moderate Risk: <b>{{moderate}}</b></div>
                <div>Low Risk: <b>{{low}}</b></div>
            </p-card>
        </div>
        <div class="col-12 md:col-6 lg:col-4">
            <p-card header="Risk Level Trend (Sample)">
                <p-chart type="line" [data]="trendChartData" [options]="trendOptions" style="height:200px;"></p-chart>
            </p-card>
        </div>
        <div class="col-12 md:col-6 lg:col-4">
            <p-card header="High Risk Patients">
                <ul>
                    <li *ngFor="let p of highRiskPatients">{{p.patientName}} ({{p.city}})</li>
                </ul>
            </p-card>
        </div>
        <div class="col-12 md:col-6 lg:col-4">
            <p-card header="Recent Assessments">
                <ul>
                    <li *ngFor="let r of recentAssessments">{{r.patientId}}: {{r.riskLevel}}</li>
                </ul>
            </p-card>
        </div>
    </div>
    `
})
export class RiskDashboardComponent implements OnInit {
    riskChartData: any;
    total = 0;
    high = 0;
    moderate = 0;
    low = 0;
    pieOptions: any;
    trendChartData: any;
    trendOptions: any;
    highRiskPatients: any[] = [];
    recentAssessments: any[] = [];

    constructor(private patientService: PatientService) {}

    ngOnInit() {
        this.patientService.getAllPatients().subscribe(patients => {
            // Assume riskLevel is available for each patient (or fetch separately if needed)
            this.patientService.getAllRiskAssessments().subscribe((risks: RiskAssessment[]) => {
                this.total = risks.length;
                this.high = risks.filter(r => r.riskLevel === 'High').length;
                this.moderate = risks.filter(r => r.riskLevel === 'Moderate').length;
                this.low = risks.filter(r => r.riskLevel === 'Low').length;
                this.riskChartData = {
                    labels: ['High', 'Moderate', 'Low'],
                    datasets: [{
                        data: [this.high, this.moderate, this.low],
                        backgroundColor: ['#e53935', '#fbc02d', '#43a047']
                    }]
                };
                this.pieOptions = {
                    responsive: true,
                    maintainAspectRatio: false
                };
                this.trendChartData = {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                        {
                            label: 'High Risk',
                            data: [65, 59, 80, 81, 56, 55, 40],
                            fill: false,
                            borderColor: '#e53935'
                        },
                        {
                            label: 'Moderate Risk',
                            data: [28, 48, 40, 19, 86, 27, 90],
                            fill: false,
                            borderColor: '#fbc02d'
                        },
                        {
                            label: 'Low Risk',
                            data: [18, 48, 77, 9, 100, 27, 40],
                            fill: false,
                            borderColor: '#43a047'
                        }
                    ]
                };
                this.trendOptions = {
                    responsive: true,
                    maintainAspectRatio: false
                };
                this.highRiskPatients = risks
                    .filter(r => r.riskLevel === 'High')
                    .map(r => patients.find(p => p.patientId === r.patientId))
                    .filter(p => p); // Filter out undefined values
                this.recentAssessments = risks.slice(0, 5);
            });
        });
    }
}
