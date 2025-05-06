import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { PatientService } from './service/patient.service';
import { AnalyticsService, AnalyticsData } from './service/admin.patient.analytics';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, CardModule, ChartModule, ButtonModule, TableModule, TabViewModule],
    template: `
        <div class="grid">
            <div class="col-12">
                <div class="card mb-0">
                    <h2>Healthcare Analytics Dashboard</h2>
                    <p class="text-secondary mb-5">Welcome to the healthcare analytics platform. Monitor patient risk factors, health metrics, and key performance indicators.</p>
                    
                    <!-- Quick Stats Section -->
                    <div class="flex flex-row gap-8">
                        <div class="col-12 md:col-6 lg:col-3 bg-slate-100 rounded-md">
                            <div class="surface-card shadow-2 p-3 border-round">
                                <div class="flex justify-content-between mb-3">
                                    <div>
                                        <span class="block text-500 font-medium mb-3">Total Patients</span>
                                        <div class="text-900 font-medium text-xl">{{stats.totalPatients}}</div>
                                    </div>
                                    <div class="flex pl-4 align-items-center justify-content-center border-round">
                                        <i class="pi pi-users text-blue-500 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6 lg:col-3 bg-slate-100 rounded-md">
                            <div class="surface-card shadow-2 p-3 border-round">
                                <div class="flex justify-content-between mb-3">
                                    <div>
                                        <span class="block text-500 font-medium mb-3">High Risk Patients</span>
                                        <div class="text-900 font-medium text-xl">{{stats.highRiskCount}}</div>
                                    </div>
                                    <div class="flex pl-4 align-items-center justify-content-center">
                                        <i class="pi pi-exclamation-circle text-red-500 text-xl"></i>
                                    </div>
                                </div>
                                <span class="text-red-500 font-medium">{{stats.highRiskPercentage}}% </span>
                                <span class="text-500">of patients</span>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6 lg:col-3 bg-slate-100 rounded-md">
                            <div class="surface-card shadow-2 p-3 border-round">
                                <div class="flex justify-content-between mb-3">
                                    <div>
                                        <span class="block text-500 font-medium mb-3">Moderate Risk Patients</span>
                                        <div class="text-900 font-medium text-xl">{{stats.moderateRiskCount}}</div>
                                    </div>
                                    <div class="flex pl-4 align-items-center justify-content-center" >
                                        <i class="pi pi-exclamation-triangle text-yellow-500 text-xl"></i>
                                    </div>
                                </div>
                                <span class="text-yellow-500 font-medium">{{stats.moderateRiskPercentage}}% </span>
                                <span class="text-500">of patients</span>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6 lg:col-3 bg-slate-100 rounded-md">
                            <div class="surface-card shadow-2 p-3 border-round">
                                <div class="flex justify-content-between mb-3">
                                    <div>
                                        <span class="block text-500 font-medium mb-3">Low Risk Patients</span>
                                        <div class="text-900 font-medium text-xl">{{stats.lowRiskCount}}</div>
                                    </div>
                                    <div class="flex pl-4 align-items-center justify-content-center">
                                        <i class="pi pi-check-circle text-green-500 text-xl"></i>
                                    </div>
                                </div>
                                <span class="text-green-500 font-medium">{{stats.lowRiskPercentage}}% </span>
                                <span class="text-500">of patients</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Main Dashboard Content -->
            <div class="col-12">
                <p-tabView>
                    <!-- Risk Overview Tab -->
                    <p-tabPanel header="Risk Overview">
                        <div class="grid">
                            <!-- Risk Distribution Navigation Card -->
                            <div class="col-12 lg:col-6 mb-4">
                                <p-card styleClass="h-full shadow-4 cursor-pointer" (click)="navigateToRiskDistribution()">
                                    <div class="flex align-items-center">
                                        <div class="flex justify-content-center align-items-center bg-primary-100 border-round" style="width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                            <i class="pi pi-chart-pie text-primary text-3xl"></i>
                                        </div>
                                        <div class="ml-4">
                                            <h4 class="mt-0 mb-1">Patient Risk Distribution</h4>
                                            <p class="mt-0 mb-0 text-700">View detailed risk distribution across patient population</p>
                                        </div>
                                    </div>
                                </p-card>
                            </div>
                            
                            <!-- Patient List Navigation Card -->
                            <div class="col-12 lg:col-6 mb-4">
                                <p-card styleClass="h-full shadow-4 cursor-pointer" (click)="navigateToPatients()">
                                    <div class="flex align-items-center">
                                        <div class="flex justify-content-center align-items-center bg-blue-100 border-round" style="width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                            <i class="pi pi-users text-blue-500 text-3xl"></i>
                                        </div>
                                        <div class="ml-4">
                                            <h4 class="mt-0 mb-1">Patient Risk Assessment</h4>
                                            <p class="mt-0 mb-0 text-700">View detailed risk assessment for individual patients</p>
                                        </div>
                                    </div>
                                </p-card>
                            </div>
                        </div>
                    </p-tabPanel>
                    
                    <!-- Health Metrics Tab -->
                    <p-tabPanel header="Health Metrics Overview">
                        <div class="grid">
                            <!-- Health Analytics Navigation Card -->
                            <div class="col-12 lg:col-6 mb-4">
                                <p-card styleClass="h-full shadow-4 cursor-pointer" (click)="navigateToAnalytics()">
                                    <div class="flex align-items-center">
                                        <div class="flex justify-content-center align-items-center bg-green-100 border-round" style="width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                            <i class="pi pi-chart-bar text-green-500 text-3xl"></i>
                                        </div>
                                        <div class="ml-4">
                                            <h4 class="mt-0 mb-1">Advanced Health Analytics</h4>
                                            <p class="mt-0 mb-0 text-700">View comprehensive health metrics and trends</p>
                                        </div>
                                    </div>
                                </p-card>
                            </div>
                            
                            <!-- Patient Demographics Card -->
                            <div class="col-12 lg:col-6 mb-4">
                                <p-card styleClass="h-full shadow-4 cursor-pointer" (click)="navigateToAnalytics()">
                                    <div class="flex align-items-center">
                                        <div class="flex justify-content-center align-items-center bg-yellow-100 border-round" style="width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                            <i class="pi pi-database text-yellow-500 text-3xl"></i>
                                        </div>
                                        <div class="ml-4">
                                            <h4 class="mt-0 mb-1">Patient Demographics</h4>
                                            <p class="mt-0 mb-0 text-700">View patient data breakdown by demographics</p>
                                        </div>
                                    </div>
                                </p-card>
                            </div>
                        </div>
                    </p-tabPanel>
                </p-tabView>
            </div>
        </div>
    `
})
export class Admin implements OnInit {
    // Risk stats
    stats = {
        totalPatients: 0,
        highRiskCount: 0,
        highRiskPercentage: 0,
        moderateRiskCount: 0,
        moderateRiskPercentage: 0,
        lowRiskCount: 0,
        lowRiskPercentage: 0
    };

    // Chart data
    barData: any;
    barOptions: any;
    pieData: any;
    pieOptions: any;
    radarData: any;
    radarOptions: any;
    riskDistributionData: any;
    riskChartOptions: any;

    // Table data
    riskFactors = [
        { name: 'Elevated Blood Pressure', count: 42, impact: 'High' },
        { name: 'High Blood Glucose', count: 38, impact: 'High' },
        { name: 'Low Hemoglobin', count: 25, impact: 'Medium' },
        { name: 'Respiratory Distress', count: 18, impact: 'Medium' },
        { name: 'Cardiac Arrhythmia', count: 15, impact: 'High' }
    ];

    constructor(
        private router: Router,
        private patientService: PatientService,
        private analyticsService: AnalyticsService,
        private http: HttpClient
    ) {}

    ngOnInit() {
        this.loadRiskDistribution();
        this.loadAnalyticsData();
    }

    loadRiskDistribution() {
        // Use the PatientService's caching mechanism instead of direct HTTP call
        this.patientService.getRiskDistribution().subscribe(distribution => {
            // Calculate total patients and percentages
            let total = 0;
            Object.values(distribution).forEach(count => total += count);
            
            this.stats.totalPatients = total;
            
            const highCount = distribution['High'] || 0;
            const moderateCount = distribution['Moderate'] || 0;
            const lowCount = distribution['Low'] || 0;
            
            this.stats.highRiskCount = highCount;
            this.stats.highRiskPercentage = Math.round((highCount / total) * 100);
            
            this.stats.moderateRiskCount = moderateCount;
            this.stats.moderateRiskPercentage = Math.round((moderateCount / total) * 100);
            
            this.stats.lowRiskCount = lowCount;
            this.stats.lowRiskPercentage = Math.round((lowCount / total) * 100);
            
            // Create pie chart data for risk distribution
            this.riskDistributionData = {
                labels: ['High Risk', 'Moderate Risk', 'Low Risk'],
                datasets: [
                    {
                        data: [highCount, moderateCount, lowCount],
                        backgroundColor: ['#e53935', '#fbc02d', '#43a047'],
                        hoverBackgroundColor: ['#c62828', '#f9a825', '#2e7d32']
                    }
                ]
            };
            
            this.riskChartOptions = {
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx: any) => {
                                const label = ctx.label || '';
                                const value = ctx.parsed || 0;
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            };
        });
    }
    
    loadAnalyticsData() {
        this.analyticsService.getAnalyticsData().subscribe({
            next: (data: AnalyticsData) => {
                this.initCharts(data);
            },
            error: (err) => {
                console.error('Error loading analytics data:', err);
                // Initialize with empty data if there's an error
                this.initCharts({
                    patientCountTimeline: [],
                    allergiesDistribution: {},
                    problemListCounts: {},
                    problemListBySex: {}
                });
            }
        });
    }
    
    initCharts(data: AnalyticsData) {
        // Get chart colors from CSS variables
        const css = getComputedStyle(document.documentElement);
        const txt = css.getPropertyValue('--text-color');
        const txt2 = css.getPropertyValue('--text-color-secondary');
        const border = css.getPropertyValue('--surface-border');
        
        // Bar chart - Top 10 health problems
        const probEntries = Object.entries(data.problemListCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        this.barData = {
            labels: probEntries.map(e => e[0]),
            datasets: [
                {
                    label: 'Patient Count',
                    data: probEntries.map(e => e[1]),
                    backgroundColor: '#42A5F5'
                }
            ]
        };
        
        this.barOptions = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { 
                    grid: { display: false },
                    ticks: { color: txt2 }
                },
                y: { 
                    grid: { display: false },
                    ticks: { color: txt2 }
                }
            }
        };
        
        // Pie chart - Allergies distribution
        const allergyEntries = Object.entries(data.allergiesDistribution)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
            
        this.pieData = {
            labels: allergyEntries.map(e => e[0]),
            datasets: [
                {
                    data: allergyEntries.map(e => e[1]),
                    backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#7E57C2']
                }
            ]
        };
        
        this.pieOptions = {
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'right',
                    labels: { color: txt }
                }
            }
        };
        
        // Radar chart - Health problems by gender
        const sexes = Object.keys(data.problemListBySex);
        const problems = Object.keys(data.problemListCounts)
            .sort((a, b) => data.problemListCounts[b] - data.problemListCounts[a])
            .slice(0, 5);
            
        const datasets = sexes.map((sex, index) => {
            const colors = ['#42A5F5', '#FFA726', '#66BB6A'];
            return {
                label: sex,
                data: problems.map(p => data.problemListBySex[sex]?.[p] || 0),
                borderColor: colors[index % colors.length],
                backgroundColor: colors[index % colors.length] + '40'
            };
        });
        
        this.radarData = {
            labels: problems,
            datasets
        };
        
        this.radarOptions = {
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'bottom',
                    labels: { color: txt }
                }
            },
            scales: {
                r: {
                    grid: { color: border + '80' },
                    angleLines: { color: border + '80' },
                    pointLabels: { color: txt }
                }
            }
        };
    }
    
    navigateToPatients() {
        this.router.navigate(['/admin/patients']);
    }
    
    navigateToRiskDistribution() {
        this.router.navigate(['/admin/risk-distribution']);
    }
    
    navigateToAnalytics() {
        this.router.navigate(['/admin/analytics']);
    }
}
