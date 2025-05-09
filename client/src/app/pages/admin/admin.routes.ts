import { Routes } from '@angular/router';
import { Admin } from './admin';
import { Schedular } from './schedular';
import { Analytics } from './analytics';
import { PatientListComponent } from './patient-list';
import { RiskAssessmentComponent } from './risk-assessment';
import { RiskDistributionComponent } from './risk-distribution.component';
import { ReportBuilderComponent } from './reporting/report-builder/report-builder';
import { VisualAnalyticsComponent } from './reporting/visual-analytics/visual-analytics';

export default [
    { path: '', component: Admin }, 
    { path: 'patients', component: PatientListComponent },        
    { path: 'risk-assessment/:id', component: RiskAssessmentComponent },
    { path: 'risk-distribution', component: RiskDistributionComponent },
    { path: 'schedular', component: Schedular },
    { path: 'analytics', component: Analytics },
    { path: 'report-builder', component: ReportBuilderComponent },
    { path: 'report-visualizer', component: VisualAnalyticsComponent}
] as Routes;
