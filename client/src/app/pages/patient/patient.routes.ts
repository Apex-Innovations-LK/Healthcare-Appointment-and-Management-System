import { Routes } from '@angular/router';
import { Patient } from './patient';
import { Appointment } from './appointment';

export default [
    { path: '', component: Patient },
    { path: 'appointment', component: Appointment }
] as Routes;
