import { Routes } from '@angular/router';
import { Doctor } from './doctor';
import { Appointment } from './appointment';
import { Schedule } from './schedule';
import { ReportBuilderComponent } from '../doctor/reporting/report-builder/report-builder';
import { VisualAnalyticsComponent } from '../doctor/reporting/visual-analytics/visual-analytics';
import { Chatbot } from './chatbot';


export default [
    { path: '', component: Doctor },
    { path: 'appointment', component: Appointment },
    { path: 'schedule', component: Schedule },
    { path: 'report-builder', component: ReportBuilderComponent },
    { path: 'visual-analytics', component: VisualAnalyticsComponent }
    { path: 'chatbot', component: Chatbot },
    { path: 'schedule', component: Schedule }
] as Routes;
