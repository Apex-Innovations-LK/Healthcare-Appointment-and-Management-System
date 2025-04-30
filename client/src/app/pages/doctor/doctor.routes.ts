import { Routes } from '@angular/router';
import { Doctor } from './doctor';
import { Appointment } from './appointment';
import { Schedule } from './schedule';

export default [
    { path: '', component: Doctor },
    { path: 'appointment', component: Appointment },
    { path: 'schedule', component: Schedule }
] as Routes;
