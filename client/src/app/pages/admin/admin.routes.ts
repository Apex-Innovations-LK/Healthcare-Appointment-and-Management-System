import { Routes } from '@angular/router';
import { Admin } from './admin';
import { Schedular } from './schedular';
import { Analytics } from './analytics';
import { PatientListComponent } from './patient-list';
import { RiskAssessmentComponent } from './risk-assessment';
import { RiskDistributionComponent } from './risk-distribution.component';
import { ReportBuilderComponent } from './reporting/report-builder/report-builder';
import { VisualAnalyticsComponent } from './reporting/visual-analytics/visual-analytics';
import { StaffUtilization } from './Staff-Utilization/staffUtilization';
import { StaffUtilizationDetailViewComponent } from './Staff-Utilization/components/staff-utilization-detail-view/staff-utilization-detail-view.component'
import { ResourceAllocation } from './resource-allocation/resource-allocation-dashboard/resourceAllocation'
import { Resources } from './resource-allocation/resources/Resources'
import { ResourceAllocationDetail } from './resource-allocation/resource-allocation-detail/resourceAllocationDetail';
import { ResourceDetail } from './resource-allocation/resource-detail/resourceDetail';

export default [
    { path: '', component: Admin }, 
    { path: 'patients', component: PatientListComponent },        
    { path: 'risk-assessment/:id', component: RiskAssessmentComponent },
    { path: 'risk-distribution', component: RiskDistributionComponent },
    { path: 'schedular', component: Schedular },
    { path: 'analytics', component: Analytics },
    { path: 'staff-utilization', component: StaffUtilization},
    { path: 'staff/:id/:avgUtilization', component: StaffUtilizationDetailViewComponent },
    { path: 'resource-allocation', component: ResourceAllocation },
    { path: 'resource-allocation/resources', component: Resources },
    { path: 'resource-allocation/resource-allocation-detail/:id', component: ResourceAllocationDetail },
    { path: 'resource-allocation/resource/:id', component: ResourceDetail },

    { path: 'report-builder', component: ReportBuilderComponent },
    { path: 'report-visualizer', component: VisualAnalyticsComponent}
] as Routes;

