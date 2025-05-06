import { Routes } from '@angular/router';
import { Patient } from './patient';
import { Appointment } from './appointment';
import { AddAppointmentComponent } from './components/add-appointmentcomponent';

export default [
    { path: '', component: Patient },
    { path: 'appointment', component: Appointment },
    { path: 'appointment/add', component: AddAppointmentComponent }
] as Routes;
