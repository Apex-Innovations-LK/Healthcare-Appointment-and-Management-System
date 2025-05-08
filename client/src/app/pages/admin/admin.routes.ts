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
import { ResourceAllocation } from './resource-allocation/resource-allocation-dashboard/resourceAllocation'
import { Resources } from './resource-allocation/resources/Resources'
import { ResourceAllocationDetail } from './resource-allocation/resource-allocation-detail/resourceAllocationDetail';
import { ResourceDetail } from './resource-allocation/resource-detail/resourceDetail';

export default [
    { path: '', component: Admin }, 
    { path: 'dashboard', component: RiskDashboardComponent },
    { path: 'patients', component: PatientListComponent },        
    { path: 'risk-assessment/:id', component: RiskAssessmentComponent },
    { path: 'empty', component: Empty },
    { path: 'schedular', component: Schedular },
    { path: 'analytics', component: Analytics },
    { path: 'staff-utilization', component: StaffUtilization},
    { path: 'staff/:id', component: StaffUtilizationDetailViewComponent },
    { path: 'resource-allocation', component: ResourceAllocation },
    { path: 'resource-allocation/resources', component: Resources },
    { path: 'resource-allocation/resource-allocation-detail/:id', component: ResourceAllocationDetail },
    { path: 'resource-allocation/resource/:id', component: ResourceDetail },

] as Routes;

