import { Routes } from '@angular/router';
import { Doctor } from './doctor';
import { Appointment } from './appointment';
import { Schedule } from './schedule';
import { Consult } from './consult';

export default [
    { path: '', component: Doctor },
    { path: 'this-week', component: Appointment },
    { path: 'next-week', component: Schedule },
    { path: 'consult', component: Consult }
] as Routes;
