import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthAnalyticsRoutingModule } from './health-analytics-routing.module';

// Standalone components
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientMetricsChartComponent } from './components/patient-metrics-chart/patient-metrics-chart.component';

// Import necessary PrimeNG modules directly
import { ButtonModule } from 'primeng/button';  // For p-button
import { ChartModule } from 'primeng/chart';    // For p-chart

@NgModule({
  imports: [
    CommonModule,
    HealthAnalyticsRoutingModule,
    ButtonModule,  // Import PrimeNG ButtonModule here
    ChartModule,   // Import PrimeNG ChartModule here
    DashboardComponent, // Import standalone DashboardComponent directly
    PatientMetricsChartComponent,  // Import standalone PatientMetricsChartComponent
  ]
})
export class HealthAnalyticsModule {}
