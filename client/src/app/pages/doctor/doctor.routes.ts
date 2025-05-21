import { Routes } from '@angular/router';
import { Doctor } from './doctor';
import { Appointment } from './appointment';
import { Schedule } from './schedule';
import { Chatbot } from './chatbot';

import { Consult } from './consult';

export default [
    { path: '', component: Doctor },
    { path: 'appointment', component: Appointment },
    { path: 'schedule', component: Schedule },
    { path: 'this-week', component: Appointment },
    { path: 'chatbot', component: Chatbot },
    { path: 'next-week', component: Schedule },
    { path: 'consult', component: Consult }
] as Routes;