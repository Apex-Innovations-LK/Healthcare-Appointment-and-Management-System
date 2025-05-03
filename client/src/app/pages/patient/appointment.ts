import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { AddAppointmentComponent } from './appointments/add-appointment.component'; 

@Component({
  selector: 'app-patient-appointment',
  standalone: true,
  imports: [
    RouterModule,
    RippleModule,
    StyleClassModule,
    ButtonModule,
    DividerModule,
    AddAppointmentComponent  
  ],
  template: `
    <div class="bg-surface-0 dark:bg-surface-900">
      <div id="home" class="landing-wrapper overflow-hidden">  
        <!-- ✅ Embed AddAppointmentComponent -->
        <app-add-appointment></app-add-appointment>
      </div>
    </div>
  `
})
export class Appointment {}
