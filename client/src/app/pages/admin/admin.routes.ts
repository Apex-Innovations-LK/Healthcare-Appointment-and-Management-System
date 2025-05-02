import { Routes } from '@angular/router';
import { Admin } from './admin';
import { Empty } from '../empty/empty';
import { Schedular } from './schedular';
import { Analytics } from './analytics';
import { PatientListComponent } from './patient-list';
import { RiskAssessmentComponent } from './risk-assessment'
import { RiskDashboardComponent } from './risk-dashboard';

export default [
    { path: '', component: Admin }, 
    { path: 'dashboard', component: RiskDashboardComponent },
    { path: 'patients', component: PatientListComponent },        
    { path: 'risk-assessment/:id', component: RiskAssessmentComponent },
    { path: 'empty', component: Empty },
    { path: 'schedular', component: Schedular },
    { path: 'analytics', component: Analytics },
] as Routes;
