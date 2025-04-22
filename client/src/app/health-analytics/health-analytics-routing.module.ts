import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientMetricsChartComponent } from './components/patient-metrics-chart/patient-metrics-chart.component';

const routes: Routes = [
  {
    path: '',  // Default route for health-analytics (loads DashboardComponent)
    component: DashboardComponent,
    children: [
      {
        path: 'patient-metrics',  // Path for the patient metrics chart
        component: PatientMetricsChartComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HealthAnalyticsRoutingModule {}
