import { Routes } from '@angular/router';
import { Patient } from './patient';
import { Appointment } from './appointment';
import { AddAppointmentComponent } from './appointments/add-appointment.component';
import { AppointmentConfirmationComponent } from './appointments/appointment-confirmation.component';
import { ViewAppointmentsComponent } from './appointments/view-appointments.component';

export default [
    { path: '', component: Patient },
    { path: 'appointment', component: Appointment },
    { path: 'appointment/view', component: ViewAppointmentsComponent },
    { path: 'appointment/add', component: AddAppointmentComponent },
    { path: 'appointment/confirmation', component: AppointmentConfirmationComponent },
] as Routes;
