import { Routes } from '@angular/router';
import { VideoCallComponent } from './video-call/video-call.component';

export const routes: Routes = [
  { path: 'telehealth', component: VideoCallComponent }, // this ensures it's loaded on root
  { path: '', redirectTo: 'telehealth', pathMatch: 'full' }, // Add default route
  { path: '**', redirectTo: 'telehealth' } 
];
