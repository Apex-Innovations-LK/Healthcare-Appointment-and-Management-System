import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { AuthStateService } from '../../../service/auth-state.service';

@Component({
    selector: 'app-home-body',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule, DividerModule, InputSwitchModule, FormsModule, ImageModule],
    template: `
        <div class="font-sans">
            <!-- Hero Section -->
            <section
                class="flex flex-col md:flex-row items-center justify-center text-black p-8 lg:p-12 min-h-[80vh]"
                style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(195, 227, 250) 100%); clip-path: ellipse(150% 87% at 93% 13%)"
            >
                <div class="text-center md:text-left max-w-2xl">
                    <h1 class="text-4xl md:text-5xl font-bold mb-4 dark:text-gray-900">Modern Healthcare Management</h1>
                    <h2 class="text-xl md:text-2xl font-semibold mb-4 dark:text-gray-500">Streamlined appointments for patients and providers</h2>
                    <p class="text-base md:text-lg mb-6">Our comprehensive system connects patients with healthcare providers efficiently, saving time and improving care.</p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <button pButton label="Get Started" icon="pi pi-arrow-right" class="p-button-lg" (click)="goToLogin()"></button>
                        <button pButton label="Learn More" icon="pi pi-info-circle" class="p-button-outlined p-button-lg" (click)="scrollToFeatures()"></button>
                    </div>
                </div>
            </section>

            <!-- Features Section -->
            <section id="features" class="py-16 px-5 md:px-12 text-center bg-white dark:bg-gray-900">
                <h2 class="text-3xl font-bold text-primary mb-12 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-14 after:h-1 after:bg-primary">Key Features</h2>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    <p-card styleClass="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <ng-template pTemplate="header">
                            <div class="flex justify-center items-center w-16 h-16 mx-auto mt-6 mb-4 bg-blue-500 text-white rounded-full">
                                <i class="pi pi-calendar text-3xl"></i>
                            </div>
                        </ng-template>
                        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Easy Scheduling</h3>
                        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">Book, reschedule, or cancel appointments with just a few clicks. Our intuitive interface makes managing your healthcare simple.</p>
                    </p-card>

                    <p-card styleClass="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <ng-template pTemplate="header">
                            <div class="flex justify-center items-center w-16 h-16 mx-auto mt-6 mb-4 bg-blue-500 text-white rounded-full">
                                <i class="pi pi-user-plus text-3xl"></i>
                            </div>
                        </ng-template>
                        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Doctor Profiles</h3>
                        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">Browse detailed profiles of healthcare providers, complete with specializations, availability, and patient reviews.</p>
                    </p-card>

                    <p-card styleClass="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <ng-template pTemplate="header">
                            <div class="flex justify-center items-center w-16 h-16 mx-auto mt-6 mb-4 bg-blue-500 text-white rounded-full">
                                <i class="pi pi-bell text-3xl"></i>
                            </div>
                        </ng-template>
                        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Smart Reminders</h3>
                        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">Receive timely notifications about upcoming appointments, medication schedules, and follow-up care.</p>
                    </p-card>
                </div>
            </section>

            <!-- User Roles Section -->
            <section class="py-16 px-5 md:px-12 text-center bg-gray-50 dark:bg-gray-900">
                <h2 class="text-3xl font-bold text-primary mb-12 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-14 after:h-1 after:bg-primary">
                    Designed For Everyone
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    <p-card styleClass="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <ng-template pTemplate="header">
                            <div class="flex justify-center items-center w-20 h-20 mx-auto mt-6 mb-4 bg-blue-500 text-white rounded-full">
                                <i class="pi pi-user text-4xl"></i>
                            </div>
                        </ng-template>
                        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Patients</h3>
                        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">Easily book appointments, access medical records, and communicate with your healthcare providers.</p>
                        <ng-template pTemplate="footer">
                            <button pButton label="Login" icon="pi pi-sign-in" class="p-button-outlined" (click)="goToLogin()"></button>
                        </ng-template>
                    </p-card>

                    <p-card styleClass="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <ng-template pTemplate="header">
                            <div class="flex justify-center items-center w-20 h-20 mx-auto mt-6 mb-4 bg-green-500 text-white rounded-full">
                                <i class="pi pi-heart text-4xl"></i>
                            </div>
                        </ng-template>
                        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Doctors</h3>
                        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">Manage your schedule, view patient histories, and provide efficient care with our comprehensive tools.</p>
                        <ng-template pTemplate="footer">
                            <button pButton label="Login" icon="pi pi-sign-in" class="p-button-outlined" (click)="goToLogin()"></button>
                        </ng-template>
                    </p-card>

                    <p-card styleClass="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <ng-template pTemplate="header">
                            <div class="flex justify-center items-center w-20 h-20 mx-auto mt-6 mb-4 bg-blue-400 text-white rounded-full">
                                <i class="pi pi-cog text-4xl"></i>
                            </div>
                        </ng-template>
                        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Administrators</h3>
                        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">Oversee operations, manage staff, and analyze data to optimize your healthcare facility's performance.</p>
                        <ng-template pTemplate="footer">
                            <button pButton label="Login" icon="pi pi-sign-in" class="p-button-outlined" (click)="goToLogin()"></button>
                        </ng-template>
                    </p-card>
                </div>
            </section>

            <!-- Testimonials Section -->
            <section class="py-16 px-5 md:px-12 text-center bg-white dark:bg-gray-900">
                <h2 class="text-3xl font-bold text-primary mb-12 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-14 after:h-1 after:bg-primary-500">What Our Users Say</h2>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    <p-card styleClass="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md">
                        <div class="text-left p-4">
                            <p class="text-lg italic text-gray-800 dark:text-gray-100 mb-4">"This system has transformed how we manage appointments. No more paperwork or scheduling conflicts!"</p>
                            <div class="text-gray-600 dark:text-gray-300">
                                <strong>Dr. Sarah Johnson</strong>
                                <span class="block">Cardiologist</span>
                            </div>
                        </div>
                    </p-card>

                    <p-card styleClass="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md">
                        <div class="text-left p-4">
                            <p class="text-lg italic text-gray-800 dark:text-gray-100 mb-4">"I love how easy it is to book appointments and get reminders. Has made managing my healthcare so much simpler."</p>
                            <div class="text-gray-600 dark:text-gray-300">
                                <strong>Michael Chen</strong>
                                <span class="block">Patient</span>
                            </div>
                        </div>
                    </p-card>
                </div>
            </section>
        </div>
    `
})
export class HomeBody implements OnInit {
    currentYear = new Date().getFullYear();

    constructor(
        private router: Router,
        public authStateService: AuthStateService
    ) {}

    ngOnInit(): void {
        // Check authentication and redirect if already logged in
        if (this.authStateService.isAuthenticated()) {
            const role = this.authStateService.getRole();
            switch (role) {
                case 'doctor':
                    this.router.navigate(['/doctor/home']);
                    break;
                case 'admin':
                    this.router.navigate(['/admin/home']);
                    break;
                case 'patient':
                    this.router.navigate(['/patient/home']);
                    break;
                default:
                    this.router.navigate(['/login']);
            }
        }
    }

    goToLogin(): void {
        this.router.navigate(['/auth/login']);
    }

    scrollToFeatures(): void {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    }
}
