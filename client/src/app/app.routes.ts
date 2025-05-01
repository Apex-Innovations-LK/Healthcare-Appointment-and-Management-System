import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { WaitingApprovalComponent } from './waiting-approval/waiting-approval.component';
import { ViewAppointmentsComponent } from './appointments/view-appointments/view-appointments.component';
import { AddAppointmentComponent } from './appointments/add-appointment/add-appointment.component';
import { AppointmentConfirmationComponent } from './appointments/appointment-confirmation/appointment-confirmation.component';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'home', component: HomeComponent },
  { path: 'appointments', component: ViewAppointmentsComponent },
  { path: 'appointments/add', component: AddAppointmentComponent },
  { path: 'appointments/confirm', component: AppointmentConfirmationComponent },
  { path: 'waiting-approval', component: WaitingApprovalComponent },
  { path: '', redirectTo: 'auth', pathMatch: 'full' }
];
