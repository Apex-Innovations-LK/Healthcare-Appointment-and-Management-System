import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ViewAppointmentsComponent } from './appointments/view-appointments.component';

@Component({
  selector: 'app-view-page-wrapper',
  standalone: true,
  imports: [
    RouterModule,
    ViewAppointmentsComponent 
  ],
  template: `
    <div class="bg-surface-0 dark:bg-surface-900">
      <div class="landing-wrapper overflow-hidden">
        <app-view-appointments></app-view-appointments>  
      </div>
    </div>
  `
})
export class ViewPageWrapper {}
