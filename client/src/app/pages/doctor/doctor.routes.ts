import { Routes } from '@angular/router';
import { Doctor } from './doctor';
import { Appointment } from './appointment';
import { Schedule } from './schedule';
import { ReportBuilderComponent } from '../doctor/reporting/report-builder/report-builder';
import { VisualAnalyticsComponent } from '../doctor/reporting/visual-analytics/visual-analytics';
import { Chatbot } from './chatbot';

import { Consult } from './consult';

export default [
    { path: '', component: Doctor },
    { path: 'appointment', component: Appointment },
    { path: 'schedule', component: Schedule },
    { path: 'report-builder', component: ReportBuilderComponent },
    { path: 'visual-analytics', component: VisualAnalyticsComponent },
    { path: 'this-week', component: Appointment },
    { path: 'chatbot', component: Chatbot },
    { path: 'next-week', component: Schedule },
    { path: 'consult', component: Consult }
] as Routes;