import { Routes } from '@angular/router';
import { Admin } from './admin';
import { Empty } from '../empty/empty';
import { Schedular } from './schedular';
import { Analytics } from './analytics';
import { PatientListComponent } from './patient-list';
import { RiskAssessmentComponent } from './risk-assessment'
import { RiskDashboardComponent } from './risk-dashboard';
import { StaffUtilization } from './Staff-Utilization/staffUtilization';
import { StaffUtilizationDetailViewComponent } from './Staff-Utilization/components/staff-utilization-detail-view/staff-utilization-detail-view.component'

export default [
    { path: '', component: Admin }, 
    { path: 'dashboard', component: RiskDashboardComponent },
    { path: 'patients', component: PatientListComponent },        
    { path: 'risk-assessment/:id', component: RiskAssessmentComponent },
    { path: 'empty', component: Empty },
    { path: 'schedular', component: Schedular },
    { path: 'analytics', component: Analytics },
    { path: 'staff-utilization', component: StaffUtilization},
    { path: 'staff/:id', component: StaffUtilizationDetailViewComponent }
] as Routes;

