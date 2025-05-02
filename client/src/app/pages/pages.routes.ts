import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { PatientListComponent } from './patient-list';
import { RiskAssessmentComponent } from './risk-assessment';
import { RiskDashboardComponent } from './risk-dashboard';

export default [
    { path: 'dashboard', component: RiskDashboardComponent },
    { path: 'patients', component: PatientListComponent },
    { path: 'risk-assessment/:id', component: RiskAssessmentComponent },
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
