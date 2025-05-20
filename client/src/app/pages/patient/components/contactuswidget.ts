import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContactUs } from '../../../models/contactUs';
import { Notification } from '../../../models/Notification';
import { NotificationService } from '../../../service/notification.service';

@Component({
    selector: 'patient-contactus-widget',
    standalone: true,
    imports: [ButtonModule, RippleModule, FormsModule, CommonModule],
    styles: [`
        :host {
            display: block;
        }
        
        #contactus {
            transition: all 0.3s ease;
            border: 1px solid rgba(0,0,0,0.1);
        }
        
        #contactus:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        input, textarea {
            transition: all 0.3s ease;
            border: 2px solid #e2e8f0;
        }
        
        input:focus, textarea:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            outline: none;
        }
        
        .p-button {
            transition: all 0.3s ease !important;
            border-width: 2px !important;
            font-weight: 600 !important;
            letter-spacing: 0.5px;
        }
        
        .p-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .contact-info-item {
            transition: all 0.3s ease;
            padding: 1rem;
            border-radius: 0.5rem;
            background: rgba(0,0,0,0.02);
        }
        
        .contact-info-item:hover {
            background: rgba(0,0,0,0.05);
            transform: translateX(5px);
        }
        
        .dark .contact-info-item {
            background: rgba(255,255,255,0.05);
        }
        
        .dark .contact-info-item:hover {
            background: rgba(255,255,255,0.1);
        }
        
        .text-muted-color {
            color: #64748b;
        }
        
        .dark .text-muted-color {
            color: #94a3b8;
        }
    `],
    template: `
        <div id="contactus" class="py-10 px-6 lg:px-20 mx-0 my-12 lg:mx-20 bg-white dark:bg-gray-900 rounded-xl shadow-md">
            <div class="text-center mb-10">
                <h2 class="text-4xl font-bold text-surface-900 dark:text-white mb-2">Contact Us</h2>
                <span class="text-muted-color text-2xl">Connect with us for seamless healthcare and appointment management at your fingertips.</span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <!-- Contact Form -->
                <form class="space-y-5" (ngSubmit)="onSubmit()">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                        <input type="text" placeholder="John Doe" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-primary dark:text-white" [(ngModel)]="contactUs.name" name="name" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input type="email" placeholder="you@example.com" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-primary dark:text-white" [(ngModel)]="contactUs.email" name="email" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                        <textarea rows="4" placeholder="How can we help you?" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-primary dark:text-white" [(ngModel)]="contactUs.message" name="message"></textarea>
                    </div>
                    <button pButton type="submit" label="Send Message" class="w-full p-button-outlined"></button>
                </form>

                <div class="space-y-6 text-gray-700 dark:text-gray-300">
                    <div class="contact-info-item">
                        <h4 class="font-semibold text-xl mb-1">Call Us</h4>
                        <p>+94 11 234 5678</p>
                    </div>
                    <div class="contact-info-item">
                        <h4 class="font-semibold text-xl mb-1">Email</h4>
                        <p>support&#64;medicare.lk</p>
                    </div>
                    <div class="contact-info-item">
                        <h4 class="font-semibold text-xl mb-1">Address</h4>
                        <p>123 Medicare Lane, Colombo 03, Sri Lanka</p>
                    </div>
                    <div class="contact-info-item">
                        <h4 class="font-semibold text-xl mb-1">Working Hours</h4>
                        <p>Mon - Sun : 8:00 AM – 10:00 PM</p>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ContactusWidget implements OnInit {
    contactUs: ContactUs = new ContactUs('', '', '');

    constructor(
        private router: Router,
        private notificationService: NotificationService
    ) {}
    ngOnInit() {
        // Initialize any data or services if needed
    }

    onSubmit() {
        const notification: Notification = new Notification(this.contactUs.email, 'Contact Us Form Submission', this.contactUs.message);

        console.log(notification);

        this.notificationService.sendNotification(notification).subscribe(
            (response) => {
                console.log('Notification sent successfully:', response);
                this.contactUs = new ContactUs('', '', '');
                this.notificationService.showSuccess('Form submitted successfully!');
            },
            (error) => {
                console.error('Error sending notification:', error);
                this.notificationService.showError('Form submission failed! Try again later.');
            }
        );
    }
}
