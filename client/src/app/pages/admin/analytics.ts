import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Chart, registerables, TooltipItem } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { FluidModule } from 'primeng/fluid';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { Router } from '@angular/router';

import { AnalyticsService, AnalyticsData, Point } from './service/admin.patient.analytics';
import { HttpClient } from '@angular/common/http';

/* Chart.js must know which controllers / elements to use */
Chart.register(...registerables);

@Component({
    selector: 'app-admin-analytics',
    standalone: true,
    imports: [CommonModule, ChartModule, FluidModule, CardModule, ButtonModule, TabViewModule],
    template: `
    <div class="grid">
        <div class="col-12">
            <div class="flex justify-content-between align-items-center mb-3">
                <h2>Advanced Analytics Dashboard</h2>
            </div>
        </div>
        
        <!-- Analytics Summary -->
        <div class="col-12">
            <p-card styleClass="mb-4">
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <div>
                        <h3 class="mt-0 mb-2">Healthcare Analytics Overview</h3>
                        <p class="mt-0 mb-3 line-height-3 text-secondary">
                            Comprehensive analysis of patient metrics, health problems, and demographic data to identify trends and improve care outcomes.
                        </p>
                    </div>
                </div>
            </p-card>
        </div>
        
        <!-- Tab View for Different Analytics -->
        <div class="col-12">
            <div class="col-12 text-right mb-3">
                <button 
                    pButton 
                    icon="pi pi-refresh" 
                    label="Refresh Data" 
                    class="p-button-outlined" 
                    (click)="forceRefreshAnalytics()"
                    [disabled]="isRefreshing"
                ></button>
            </div>
            <p-tabView>
                <!-- Patient Demographics Tab -->
                <p-tabPanel header="Patient Demographics">
                    <div class="grid space-y-4">
                        <!-- Timeline Chart -->
                        <div class="col-12 xl:col-6">
                            <p-card>
                                <ng-template pTemplate="header">
                                    <div class="p-3 flex-col justify-content-between align-items-center">
                                        <h4 class="m-0">Patient Timeline</h4>
                                        <span class="text-sm text-500">Monthly Patient Count</span>
                                    </div>
                                </ng-template>
                                <div>
                                    <p-chart type="line" [data]="lineData" [options]="lineOpts"></p-chart>
                                </div>
                            </p-card>
                        </div>
                        
                        <!-- Radar Chart -->
                        <div class="col-12 xl:col-6">
                            <p-card>
                                <ng-template pTemplate="header">
                                    <div class="p-3 flex-col justify-content-between align-items-center">
                                        <h4 class="m-0">Gender-Based Analysis</h4>
                                        <span class="text-sm text-500">Problem Distribution by Gender</span>
                                    </div>
                                </ng-template>
                                <div>
                                    <p-chart type="radar" [data]="radarData" [options]="radarOpts"></p-chart>
                                </div>
                            </p-card>
                        </div>
                    </div>
                </p-tabPanel>
                
                <!-- Health Issues Tab -->
                <p-tabPanel header="Health Issues Analysis">
                    <div class="grid space-y-4">
                        <!-- Bar Chart -->
                        <div class="col-12 xl:col-6">
                            <p-card>
                                <ng-template pTemplate="header">
                                    <div class="p-3 flex-col justify-content-between align-items-center">
                                        <h4 class="m-0">Top Health Problems</h4>
                                        <span class="text-sm text-500">Most Common Patient Issues</span>
                                    </div>
                                </ng-template>
                                <div>
                                    <p-chart type="bar" [data]="barData" [options]="barOpts"></p-chart>
                                </div>
                            </p-card>
                        </div>
                        
                        <!-- Pie Chart -->
                        <div class="col-12 xl:col-6">
                            <p-card>
                                <ng-template pTemplate="header">
                                    <div class="p-3 flex-col justify-content-between align-items-center">
                                        <h4 class="m-0">Allergy Distribution</h4>
                                        <span class="text-sm text-500">Patient Allergies Breakdown</span>
                                    </div>
                                </ng-template>
                                <div>
                                    <p-chart type="pie" [data]="pieData" [options]="pieOpts"></p-chart>
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
export class Analytics implements OnInit, OnDestroy {
    /* Chart‑bound objects */
    lineData: any;
    lineOpts: any;
    barData: any;
    barOpts: any;
    pieData: any;
    pieOpts: any;
    radarData: any;
    radarOpts: any;
    polarData: any;
    polarOpts: any;

    private analyticsCache: AnalyticsData | null = null;
    private analyticsCacheTime: number = 0;
    private readonly CACHE_KEY = 'analytics_data_cache';
    private readonly CACHE_TIME_KEY = 'analytics_data_cache_time';
    private readonly CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes

    private sub?: Subscription;

    isRefreshing = false;

    constructor(
        private api: AnalyticsService,
        private http: HttpClient,
        private router: Router
    ) {
        this.loadCacheFromStorage();
    }

    ngOnInit(): void {
        if (this.analyticsCache && !this.isCacheExpired()) {
            this.initCharts(this.analyticsCache);
        } else {
            this.fetchAndCacheAnalytics();
        }
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    forceRefreshAnalytics(): void {
        this.isRefreshing = true;
        this.clearAnalyticsCache();
        this.fetchAndCacheAnalytics(true);
        // Set isRefreshing to false after data is loaded (in fetchAndCacheAnalytics)
    }

    private fetchAndCacheAnalytics(forceRefresh: boolean = false): void {
        if (this.sub) this.sub.unsubscribe();
        this.sub = this.api.getAnalyticsData().subscribe({
            next: (res) => {
                this.analyticsCache = res;
                this.analyticsCacheTime = Date.now();
                this.saveCacheToStorage(res, this.analyticsCacheTime);
                this.initCharts(res);
                this.isRefreshing = false;
            },
            error: (err) => {
                console.error('Error fetching analytics data:', err);
                this.initCharts(this.emptyAnalytics());
                this.isRefreshing = false;
            }
        });
    }

    private isCacheExpired(): boolean {
        const now = Date.now();
        return (now - this.analyticsCacheTime) > this.CACHE_EXPIRY;
    }

    private loadCacheFromStorage(): void {
        const cachedData = localStorage.getItem(this.CACHE_KEY);
        const cachedTime = localStorage.getItem(this.CACHE_TIME_KEY);
        if (cachedData && cachedTime) {
            const timestamp = parseInt(cachedTime, 10);
            const now = Date.now();
            if (now - timestamp < this.CACHE_EXPIRY) {
                this.analyticsCache = JSON.parse(cachedData);
                this.analyticsCacheTime = timestamp;
            } else {
                this.clearAnalyticsCache();
            }
        }
    }

    private saveCacheToStorage(data: AnalyticsData, timestamp: number): void {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(this.CACHE_TIME_KEY, timestamp.toString());
    }

    clearAnalyticsCache(): void {
        this.analyticsCache = null;
        this.analyticsCacheTime = 0;
        localStorage.removeItem(this.CACHE_KEY);
        localStorage.removeItem(this.CACHE_TIME_KEY);
    }

    /* ---------- build demo object if request fails ---------- */
    private emptyAnalytics(): AnalyticsData {
        return {
            patientCountTimeline: [],
            allergiesDistribution: {},
            problemListCounts: {},
            problemListBySex: {}
        };
    }
    
    /* ===============  CHART INITIALISATION  =============== */
    private initCharts(data: AnalyticsData): void {
        /* ~~ css colours ~~ */
        const css = getComputedStyle(document.documentElement);
        const txt = css.getPropertyValue('--text-color');
        const txt2 = css.getPropertyValue('--text-color-secondary');
        const border = css.getPropertyValue('--surface-border');
        const prim = css.getPropertyValue('--p-primary-500');
        const prim2 = css.getPropertyValue('--p-primary-300');

        /* --------------------------------------------------
          LINE CHART  ‑ Patient count over time
          -------------------------------------------------- */
        const timeline: Point[] = data.patientCountTimeline;
        this.lineData = {
            labels: timeline.map((p) => p.date),
            datasets: [
                {
                    label: 'Patients',
                    data: timeline.map((p) => p.count),
                    borderColor: prim,
                    backgroundColor: prim,
                    fill: false,
                    tension: 0.4
                }
            ]
        };
        this.lineOpts = {
            maintainAspectRatio: false,
            plugins: { 
                legend: { labels: { color: txt } },
                tooltip: {
                    callbacks: {
                        title: (items: any[]) => {
                            if (items.length > 0) {
                                const item = items[0];
                                return `Month: ${item.label}`;
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                x: { ticks: { color: txt2 }, grid: { color: border, drawBorder: false } },
                y: { ticks: { color: txt2 }, grid: { color: border, drawBorder: false } }
            }
        };

        /* --------------------------------------------------
          BAR CHART  ‑ Top 10 problem list items
          -------------------------------------------------- */
        const probEntries = Object.entries(data.problemListCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        const probLabels = probEntries.map((e) => e[0]);
        const probValues = probEntries.map((e) => e[1]);

        this.barData = {
            labels: probLabels,
            datasets: [
                {
                    label: 'Patient Count',
                    data: probValues,
                    backgroundColor: '#42A5F5'
                }
            ]
        };
        
        this.barOpts = {
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: { 
                legend: { 
                    display: false 
                }
            },
            scales: {
                x: { grid: { display: false } },
                y: { grid: { display: false } }
            }
        };

        /* --------------------------------------------------
          PIE / DOUGHNUT  ‑ Allergy distribution
          -------------------------------------------------- */
        const allergyLabels = Object.keys(data.allergiesDistribution);
        const allergyVals = Object.values(data.allergiesDistribution);

        this.pieData = {
            labels: allergyLabels.length ? allergyLabels : ['No‑Data'],
            datasets: [
            {
                data: allergyVals.length ? allergyVals : [1],
                backgroundColor: [
                '#1976D2', // Blue
                '#388E3C', // Green
                '#FBC02D', // Yellow
                '#0288D1', // Light Blue
                '#7B1FA2', // Purple
                '#C62828', // Red
                '#00897B', // Teal
                '#F57C00', // Orange
                '#455A64', // Blue Grey
                '#6D4C41'  // Brown
                ]
            }
            ]
        };
        
        this.pieOpts = {
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: true,
                    position: 'right',
                    labels: { 
                        color: txt, 
                        usePointStyle: true, 
                        padding: 20 
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx: TooltipItem<'pie'>) => `${ctx.label}: ${ctx.parsed} patients`
                    }
                }
            }
        };

        /* --------------------------------------------------
          RADAR CHART ‑ Problem list split by sex
          (first 6 problems for readability)
          -------------------------------------------------- */
        const sexes = Object.keys(data.problemListBySex);
        const radarLabels = Object.keys(data.problemListCounts)
            .sort((a, b) => data.problemListCounts[b] - data.problemListCounts[a])
            .slice(0, 6);

        const radarDatasets = sexes.map((sex, idx) => {
            const vals = radarLabels.map((p) => data.problemListBySex[sex]?.[p] ?? 0);

            const colors = ['#42A5F5', '#FFA726', '#66BB6A'];
            const base = colors[idx % colors.length];
            return {
                label: sex,
                data: vals,
                borderColor: base,
                backgroundColor: base + '40'
            };
        });

        this.radarData = { labels: radarLabels, datasets: radarDatasets };
        this.radarOpts = {
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
                    pointLabels: { 
                        color: txt,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        };
    }
    
    // Navigation methods
    navigateToDashboard() {
        this.router.navigate(['/admin']);
    }
    
    navigateToPatients() {
        this.router.navigate(['/admin/patients']);
    }
    
    navigateToRiskDistribution() {
        this.router.navigate(['/admin/risk-distribution']);
    }
}
