import { Routes } from '@angular/router';
import { Admin } from './admin';
import { Schedular } from './schedular';
import { Analytics } from './analytics';
import { PatientListComponent } from './patient-list';
import { RiskAssessmentComponent } from './risk-assessment';
import { RiskDistributionComponent } from './risk-distribution.component';

export default [
    { path: '', component: Admin }, 
    { path: 'patients', component: PatientListComponent },        
    { path: 'risk-assessment/:id', component: RiskAssessmentComponent },
    { path: 'risk-distribution', component: RiskDistributionComponent },
    { path: 'schedular', component: Schedular },
    { path: 'analytics', component: Analytics },
] as Routes;
