import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { WaitingApprovalComponent } from './waiting-approval/waiting-approval.component';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  // { path: '**', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'waiting-approval', component: WaitingApprovalComponent },

];
