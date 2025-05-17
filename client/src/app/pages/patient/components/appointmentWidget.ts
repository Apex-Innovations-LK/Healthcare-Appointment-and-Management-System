import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';

@Component({
    selector: 'patient-appointment-widget',
    standalone: true,
    imports: [ButtonModule, RippleModule],
    template: `
        <div class="py-10 px-6 lg:px-20 mx-0 my-12 lg:mx-20 bg-white dark:bg-gray-900 rounded-xl shadow-md">
            <h2 class="text-4xl font-bold text-surface-900 dark:text-white mb-2 text-center">Find Your Doctor</h2>
            <div class="flex flex-col items-center justify-center space-y-4">
                <span class="text-muted-color text-2xl">Connect with trusted specialists and manage appointments effortlessly.</span>
                <div class="flex flex-col space-y-4 mt-6">
                    <p-button label=" Make an Appointment" styleClass="p-button p-component md:w-full text-center block" (click)="navigateToAppointment()"></p-button>
                </div>
            </div>
        </div>
    `
})
export class AppointmentWidget {
    constructor(private router: Router) {}
    navigateToAppointment() {
        this.router.navigate(['patient/appointment/add']);
    }
}
