import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'patient-contactus-widget',
    standalone: true,
    imports: [ButtonModule, RippleModule, FormsModule],
    template: `
        <div id="contactus" class="py-10 px-6 lg:px-20 mx-0 my-12 lg:mx-20 bg-white dark:bg-gray-900 rounded-xl shadow-md">
            <div class="text-center mb-10">
                <h2 class="text-4xl font-bold text-surface-900 dark:text-white mb-2">Contact Us</h2>
                <span class="text-muted-color text-2xl">Connect with us for seamless healthcare and appointment management at your fingertips.</span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <!-- Contact Form -->
                <form class="space-y-5">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                        <input type="text" placeholder="John Doe" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-primary dark:text-white" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input type="email" placeholder="you@example.com" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-primary dark:text-white" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                        <textarea rows="4" placeholder="How can we help you?" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-primary dark:text-white"></textarea>
                    </div>
                    <button pButton type="submit" label="Send Message" class="w-full p-button-outlined"></button>
                </form>

                <div class="space-y-6 text-gray-700 dark:text-gray-300">
                    <div>
                        <h4 class="font-semibold text-xl mb-1">Call Us</h4>
                        <p>+94 11 234 5678</p>
                    </div>
                    <div>
                        <h4 class="font-semibold text-xl mb-1">Email</h4>
                        <p>supportmedicare.lk</p>
                    </div>
                    <div>
                        <h4 class="font-semibold text-xl mb-1">Address</h4>
                        <p>123 Medicare Lane, Colombo 03, Sri Lanka</p>
                    </div>
                    <div>
                        <h4 class="font-semibold text-xl mb-1">Working Hours</h4>
                        <p>Mon - Fri: 8:00 AM – 6:00 PM<br />Sat: 9:00 AM – 1:00 PM</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-center mb-10">
            <h2 class="text-4xl font-bold text-surface-900 dark:text-white mb-2">Find Your Doctor</h2>
            <div class="flex flex-col items-center justify-center space-y-4">
                <span class="text-muted-color text-2xl">Connect with trusted specialists and manage appointments effortlessly.</span>
                <p-button label=" Make an Appointment" styleClass="p-button p-component md:w-full text-center block" (click)="navigateToAppointment()"></p-button>
                 <p-button label=" View your Appointments" styleClass="p-button p-component md:w-full text-center block" (click)="navigateToViewAppointments()"></p-button>
            </div>
        </div>
    `
})
export class ContactusWidget {
    constructor(private router: Router) {}
    navigateToAppointment() {
        this.router.navigate(['patient/appointment/add']);
    }
    navigateToViewAppointments() {
        this.router.navigate(['patient/appointment/view']); 
    }
}
