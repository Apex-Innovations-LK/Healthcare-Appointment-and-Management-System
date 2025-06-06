import { Routes } from '@angular/router';
import { Patient } from './patient';
import { Appointment } from './appointment';
import { AddAppointmentComponent } from './components/add-appointmentcomponent';
import { ViewAppointmentComponent } from './components/view-appointmentcomponent';

export default [
    { path: '', component: Patient },
    { path: 'appointment', component: Appointment },
    { path: 'appointment/add', component: AddAppointmentComponent },
    { path: 'appointment/view', component: ViewAppointmentComponent },

] as Routes;
