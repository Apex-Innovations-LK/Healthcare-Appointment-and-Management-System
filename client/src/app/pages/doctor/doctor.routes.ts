import { Routes } from '@angular/router';
import { Doctor } from './doctor';
import { Appointment } from './appointment';
import { Schedule } from './schedule';

export default [
    { path: '', component: Doctor },
    { path: 'this-week', component: Appointment },
    { path: 'next-week', component: Schedule }
] as Routes;
