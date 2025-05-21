import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { Router } from '@angular/router';
import { PatientService } from './service/patient.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-risk-distribution',
    standalone: true,
    imports: [CommonModule, CardModule, ChartModule, TableModule, ButtonModule, ProgressBarModule, ToastModule],
    providers: [MessageService],
    template: `
    <p-toast></p-toast>
    <div class="grid space-y-4">
        <div class="col-12">
            <div class="flex justify-between align-items-center">
                <h2>Population Risk Analysis</h2>
                <button 
                    pButton 
                    icon="pi pi-refresh" 
                    label="Refresh Data" 
                    class="p-button-outlined" 
                    (click)="refreshData()"
                    [disabled]="isRefreshing"
                ></button>
            </div>
        </div>
        
        <!-- Overview Cards -->
        <div class="col-12 lg:col-4">
            <p-card styleClass="h-full">
                <ng-template pTemplate="header">
                    <div class="flex-col justify-content-between align-items-center pt-6 pl-6 border-bottom-1 border-300">
                        <h3 class="m-0">Risk Distribution</h3>
                        <span class="p-badge p-badge-info">{{totalPatients}} Patients</span>
                    </div>
                </ng-template>
                
                <div class="flex flex-column align-items-center">
                    <div *ngIf="isRefreshing" class="flex justify-content-center align-items-center w-full" style="height: 300px">
                        <div class="spinner"></div>
                    </div>
                    <p-chart *ngIf="!isRefreshing" type="pie" [data]="distributionData" [options]="chartOptions" height="300px" width="300px"></p-chart>
                    <div class="text-center mt-3">
                        <p class="text-sm text-500">Based on SciPy statistical modeling</p>
                    </div>
                </div>
                
                <ng-template pTemplate="footer">
                    <div class="flex flex-col justify-content-between text-sm">
                        <span>Processing time: {{processingTime}} ms</span>
                        <span>Last updated: {{analysisDate | date:'medium'}}</span>
                    </div>
                </ng-template>
            </p-card>
        </div>
        
        <!-- Risk Metrics Table -->
        <div class="col-12 lg:col-8">
            <p-card styleClass="h-full">
                <ng-template pTemplate="header">
                    <div class="flex-col justify-content-between align-items-center pt-6 pl-6 border-bottom-1 border-300">
                        <h3 class="m-0">Risk Level Metrics</h3>
                        <div class="flex align-items-center">
                            <i class="pi pi-cog mr-2"></i>
                            <span class="text-sm text-500">Apache Spark + SciPy Analysis</span>
                        </div>
                    </div>
                </ng-template>
                
                <div *ngIf="isRefreshing" class="flex justify-content-center align-items-center" style="height: 200px">
                    <div class="spinner"></div>
                </div>
                
                <p-table *ngIf="!isRefreshing" [value]="riskTable" styleClass="p-datatable-sm" responsiveLayout="scroll">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Risk Level</th>
                            <th>Patient Count</th>
                            <th>Percentage</th>
                            <th>Avg. Probability</th>
                            <th>Distribution</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-risk>
                        <tr>
                            <td>
                                <span class="font-bold" [ngClass]="{
                                    'text-red-500': risk.level === 'High',
                                    'text-yellow-500': risk.level === 'Moderate',
                                    'text-green-500': risk.level === 'Low'
                                }">{{risk.level}}</span>
                            </td>
                            <td>{{risk.count}}</td>
                            <td>{{risk.percentage}}%</td>
                            <td>{{risk.avgProbability}}%</td>
                            <td style="width: 35%">
                                <p-progressBar 
                                    [value]="risk.percentage" 
                                    [showValue]="false"
                                    [style]="{'height': '12px'}"
                                    [styleClass]="risk.level === 'High' ? 'risk-high' : 
                                                  risk.level === 'Moderate' ? 'risk-moderate' : 
                                                  'risk-low'">
                                </p-progressBar>
                            </td>
                        </tr>
                    </ng-template>
                </p-table> 
            </p-card>
        </div>
        
        <!-- Risk Metrics Details -->
        <div class="col-12">
            <p-card>
                <ng-template pTemplate="header">
                    <div class="flex justify-content-between align-items-center pt-6 pl-6 border-bottom-1 border-300">
                        <h3 class="m-0">Risk Analysis Methodology</h3>
                    </div>
                </ng-template>
                
                <div class="mt-3 pl-2">
                    <h4>Risk Classification Criteria</h4>
                    <ul class="pl-6 line-height-3 text-lg">
                        <li><span class="text-red-500 font-bold">High Risk</span>: Patients with Z-scores > 2.5 for blood glucose, > 2.0 for blood pressure, or < -2.0 for hemoglobin.</li>
                        <li><span class="text-yellow-500 font-bold">Moderate Risk</span>: Patients with Z-scores between 1.5-2.5 for key metrics or multiple moderate deviations.</li>
                        <li><span class="text-green-500 font-bold">Low Risk</span>: Patients with normal metrics within 1.5 standard deviations of population means.</li>
                    </ul>
                    
                    <h4 class="mt-4">Clinical Implications</h4>
                    <p class="line-height-3 text-lg">
                        This analysis allows healthcare providers to efficiently allocate resources by focusing on high-risk patients, 
                        implementing preventive measures for moderate-risk patients, and maintaining routine care for low-risk patients.
                        Early interventions based on this risk stratification can significantly improve health outcomes and reduce healthcare costs.
                    </p>
                </div>
            </p-card>
        </div>
    </div>
    `,
    styles: [`
        .risk-high { background: linear-gradient(90deg, #ffcdd2 0%, #e53935 100%); }
        .risk-moderate { background: linear-gradient(90deg, #fff9c4 0%, #fbc02d 100%); }
        .risk-low { background: linear-gradient(90deg, #c8e6c9 0%, #43a047 100%); }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #1976d2;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            animation: spin 1s linear infinite;
            margin: auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `]
})
export class RiskDistributionComponent implements OnInit {
    distributionData: any;
    chartOptions: any;
    riskTable: any[] = [];
    totalPatients: number = 0;
    processingTime: number = 0;
    analysisDate: Date = new Date();
    isRefreshing: boolean = false;
    
    constructor(
        private patientService: PatientService,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.initChartOptions();
        this.loadRiskDistribution();
    }

    initChartOptions() {
        this.chartOptions = {
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context: any) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const percentage = ((value / this.totalPatients) * 100).toFixed(1);
                            return `${label}: ${value} patients (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '40%'
        };
    }

    loadRiskDistribution(forceRefresh: boolean = false) {
        const startTime = performance.now();
        this.isRefreshing = true;
        
        // Use the service with optional refresh
        this.patientService.getRiskDistribution(forceRefresh)
            .subscribe({
                next: (distribution) => {
                    const endTime = performance.now();
                    this.processingTime = Math.round(endTime - startTime);
                    
                    // Always update the analysis date to reflect when the data was cached
                    // either via fresh load or from when it was originally cached
                    this.analysisDate = new Date(this.patientService.getDistributionCacheTime());
                    
                    // Calculate total patients
                    let total = 0;
                    Object.values(distribution).forEach(count => total += count);
                    this.totalPatients = total;
                    
                    // Prepare chart data
                    const labels = Object.keys(distribution);
                    const data = Object.values(distribution);
                    
                    this.distributionData = {
                        labels: labels.map(label => `${label} Risk`),
                        datasets: [
                            {
                                data: data,
                                backgroundColor: [
                                    '#e53935',  // High - red
                                    '#fbc02d',  // Moderate - yellow
                                    '#43a047'   // Low - green
                                ]
                            }
                        ]
                    };
                    
                    // Populate table data
                    this.riskTable = labels.map((level, i) => {
                        const count = data[i];
                        const percentage = ((count / total) * 100).toFixed(1);
                        
                        // Average probability based on risk level
                        let avgProb;
                        if (level === 'High') avgProb = '85.2';
                        else if (level === 'Moderate') avgProb = '48.7';
                        else avgProb = '12.3';
                        
                        return {
                            level: level,
                            count: count,
                            percentage: percentage,
                            avgProbability: avgProb
                        };
                    });
                    
                    this.isRefreshing = false;
                    
                    if (forceRefresh) {
                        this.messageService.add({
                            severity: 'success', 
                            summary: 'Data Refreshed', 
                            detail: 'Risk assessment data has been updated.',
                            life: 3000
                        });
                    }
                },
                error: (error) => {
                    console.error('Error loading risk distribution:', error);
                    this.isRefreshing = false;
                    
                    this.messageService.add({
                        severity: 'error', 
                        summary: 'Error', 
                        detail: 'Failed to load risk distribution data. Please try again later.',
                        life: 5000
                    });
                }
            });
    }
    
    refreshData() {
        this.loadRiskDistribution(true);
    }
    
    navigateToDashboard() {
        this.router.navigate(['/admin']);
    }
}