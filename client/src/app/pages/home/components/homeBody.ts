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
        <div class="landing-page" [ngClass]="{ 'dark-theme': isDarkMode }">
            <section class="hero flex flex-col md:flex-row items-center justify-center text-white p-12 bg-gradient-to-br from-gray-500 via-bray-600 to-gray-700 min-h-[80vh]">
                <div class="hero-content text-center md:text-left max-w-2xl">
                    <h1 class="text-5xl font-bold mb-4">Modern Healthcare Management</h1>
                    <h2 class="text-2xl font-semibold mb-4 text-white">Streamlined appointments for patients and providers</h2>
                    <p class="text-lg mb-6 text-white">Our comprehensive system connects patients with healthcare providers efficiently, saving time and improving care.</p>
                    <div class="hero-buttons flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <button pButton label="Get Started" icon="pi pi-arrow-right" class="p-button-lg" (click)="goToLogin()"></button>
                        <button pButton label="Learn More" icon="pi pi-info-circle" class="p-button-outlined p-button-lg" (click)="scrollToFeatures()"></button>
                    </div>
                </div>
            </section>

            <section id="features" class="features">
                <h2>Key Features</h2>
                <div class="feature-cards">
                    <p-card styleClass="feature-card">
                        <ng-template pTemplate="header">
                            <div class="feature-icon">
                                <i class="pi pi-calendar"></i>
                            </div>
                        </ng-template>
                        <h3>Easy Scheduling</h3>
                        <p>Book, reschedule, or cancel appointments with just a few clicks. Our intuitive interface makes managing your healthcare simple.</p>
                    </p-card>

                    <p-card styleClass="feature-card">
                        <ng-template pTemplate="header">
                            <div class="feature-icon">
                                <i class="pi pi-user-plus"></i>
                            </div>
                        </ng-template>
                        <h3>Doctor Profiles</h3>
                        <p>Browse detailed profiles of healthcare providers, complete with specializations, availability, and patient reviews.</p>
                    </p-card>

                    <p-card styleClass="feature-card">
                        <ng-template pTemplate="header">
                            <div class="feature-icon">
                                <i class="pi pi-bell"></i>
                            </div>
                        </ng-template>
                        <h3>Smart Reminders</h3>
                        <p>Receive timely notifications about upcoming appointments, medication schedules, and follow-up care.</p>
                    </p-card>
                </div>
            </section>

            <section class="user-roles">
                <h2>Designed For Everyone</h2>
                <div class="role-cards">
                    <p-card styleClass="role-card">
                        <ng-template pTemplate="header">
                            <div class="role-icon patient-icon">
                                <i class="pi pi-user"></i>
                            </div>
                        </ng-template>
                        <h3>Patients</h3>
                        <p>Easily book appointments, access medical records, and communicate with your healthcare providers.</p>
                        <ng-template pTemplate="footer">
                            <button pButton label="Patient Login" icon="pi pi-sign-in" class="p-button-outlined" (click)="goToLogin()"></button>
                        </ng-template>
                    </p-card>

                    <p-card styleClass="role-card">
                        <ng-template pTemplate="header">
                            <div class="role-icon doctor-icon">
                                <i class="pi pi-heart"></i>
                            </div>
                        </ng-template>
                        <h3>Doctors</h3>
                        <p>Manage your schedule, view patient histories, and provide efficient care with our comprehensive tools.</p>
                        <ng-template pTemplate="footer">
                            <button pButton label="Doctor Login" icon="pi pi-sign-in" class="p-button-outlined" (click)="goToLogin()"></button>
                        </ng-template>
                    </p-card>

                    <p-card styleClass="role-card">
                        <ng-template pTemplate="header">
                            <div class="role-icon admin-icon">
                                <i class="pi pi-cog"></i>
                            </div>
                        </ng-template>
                        <h3>Administrators</h3>
                        <p>Oversee operations, manage staff, and analyze data to optimize your healthcare facility's performance.</p>
                        <ng-template pTemplate="footer">
                            <button pButton label="Admin Login" icon="pi pi-sign-in" class="p-button-outlined" (click)="goToLogin()"></button>
                        </ng-template>
                    </p-card>
                </div>
            </section>

            <section class="testimonials">
                <h2>What Our Users Say</h2>
                <div class="testimonial-cards">
                    <p-card styleClass="testimonial-card">
                        <div class="testimonial-content">
                            <p>"This system has transformed how we manage appointments. No more paperwork or scheduling conflicts!"</p>
                            <div class="testimonial-author">
                                <strong>Dr. Sarah Johnson</strong>
                                <span>Cardiologist</span>
                            </div>
                        </div>
                    </p-card>

                    <p-card styleClass="testimonial-card">
                        <div class="testimonial-content">
                            <p>"I love how easy it is to book appointments and get reminders. Has made managing my healthcare so much simpler."</p>
                            <div class="testimonial-author">
                                <strong>Michael Chen</strong>
                                <span>Patient</span>
                            </div>
                        </div>
                    </p-card>
                </div>
            </section>
        </div>
    `,
    styles: [
        `
            /* Base Styles */
            :host {
                font-family: 'Roboto', sans-serif;
                display: block;
            }

            .landing-page {
                --primary-color: #2196f3;
                --secondary-color: #03a9f4;
                --accent-color: #2dd36f;
                --text-color: #333333;
                --text-light: #666666;
                --bg-color: #ffffff;
                --bg-alt: #f5f7f9;
                --card-bg: #ffffff;
                --border-color: #e0e0e0;
                --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

                color: var(--text-color);
                background-color: var(--bg-color);
                transition: all 0.3s ease;
            }

            /* Dark Theme Colors */
            .dark-theme {
                --primary-color: #90caf9;
                --secondary-color: #64b5f6;
                --accent-color: #4ade80;
                --text-color: #e0e0e0;
                --text-light: #bbbbbb;
                --bg-color: #121212;
                --bg-alt: #1e1e1e;
                --card-bg: #1e1e1e;
                --border-color: #333333;
                --shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }

            /* Header Styles */
            header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 5%;
                background-color: var(--bg-color);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                position: sticky;
                top: 0;
                z-index: 100;
            }

            .logo h1 {
                font-size: 1.75rem;
                font-weight: 700;
                color: var(--primary-color);
                margin: 0;
            }

            .plus {
                color: var(--accent-color);
            }

            .header-actions {
                display: flex;
                align-items: center;
                gap: 1.5rem;
            }

            .theme-toggle {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: var(--text-light);
            }

            /* Hero Section */
            .hero {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 4rem 5%;
                background-color: var(--bg-alt);
                min-height: 70vh;
            }

            .hero-content {
                flex: 1;
                max-width: 600px;
            }

            .hero-content h1 {
                font-size: 2.8rem;
                font-weight: 700;
                color: var(--primary-color);
                margin-bottom: 1rem;
                line-height: 1.2;
            }

            .hero-content h2 {
                font-size: 1.5rem;
                font-weight: 500;
                color: white;
                margin-bottom: 1.5rem;
                line-height: 1.4;
            }

            .hero-content p {
                font-size: 1.1rem;
                line-height: 1.6;
                color: gray-700;
                margin-bottom: 2rem;
            }

            .hero-buttons {
                display: flex;
                gap: 1rem;
            }

            .hero-image {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .hero-image img {
                max-width: 100%;
                height: auto;
                max-height: 400px;
            }

            /* Features Section */
            .features {
                padding: 4rem 5%;
                background-color: var(--bg-color);
                text-align: center;
            }

            .features h2,
            .user-roles h2,
            .testimonials h2 {
                font-size: 2.2rem;
                color: var(--primary-color);
                margin-bottom: 3rem;
                position: relative;
            }

            .features h2::after,
            .user-roles h2::after,
            .testimonials h2::after {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 3px;
                background-color: var(--accent-color);
            }

            .feature-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
                margin-top: 2rem;
            }

            .feature-card {
                background-color: var(--card-bg) !important;
                border: 1px solid var(--border-color) !important;
                border-radius: 8px !important;
                overflow: hidden;
                box-shadow: var(--shadow) !important;
                transition:
                    transform 0.3s ease,
                    box-shadow 0.3s ease;
            }

            .feature-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
            }

            .feature-icon {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 70px;
                height: 70px;
                margin: 1.5rem auto;
                background-color: var(--primary-color);
                color: white;
                border-radius: 50%;
            }

            .feature-icon i {
                font-size: 2rem;
            }

            .feature-card h3 {
                font-size: 1.4rem;
                font-weight: 600;
                color: var(--text-color);
                margin-bottom: 1rem;
            }

            .feature-card p {
                color: var(--text-light);
                line-height: 1.6;
            }

            /* User Roles Section */
            .user-roles {
                padding: 4rem 5%;
                background-color: var(--bg-alt);
                text-align: center;
            }

            .role-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
                margin-top: 2rem;
            }

            .role-card {
                background-color: var(--card-bg) !important;
                border: 1px solid var(--border-color) !important;
                border-radius: 8px !important;
                overflow: hidden;
                box-shadow: var(--shadow) !important;
                transition:
                    transform 0.3s ease,
                    box-shadow 0.3s ease;
            }

            .role-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
            }

            .role-icon {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 80px;
                height: 80px;
                margin: 1.5rem auto;
                color: white;
                border-radius: 50%;
            }

            .patient-icon {
                background-color: var(--primary-color);
            }

            .doctor-icon {
                background-color: var(--accent-color);
            }

            .admin-icon {
                background-color: var(--secondary-color);
            }

            .role-icon i {
                font-size: 2.5rem;
            }

            .role-card h3 {
                font-size: 1.4rem;
                font-weight: 600;
                color: var(--text-color);
                margin-bottom: 1rem;
            }

            .role-card p {
                color: var(--text-light);
                line-height: 1.6;
                margin-bottom: 1.5rem;
            }

            /* Testimonials Section */
            .testimonials {
                padding: 4rem 5%;
                background-color: var(--bg-color);
                text-align: center;
            }

            .testimonial-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 2rem;
                margin-top: 2rem;
            }

            .testimonial-card {
                background-color: var(--card-bg) !important;
                border: 1px solid var(--border-color) !important;
                border-radius: 8px !important;
                overflow: hidden;
                box-shadow: var(--shadow) !important;
            }

            .testimonial-content {
                padding: 1rem;
                text-align: left;
            }

            .testimonial-content p {
                font-size: 1.1rem;
                line-height: 1.6;
                color: var(--text-color);
                font-style: italic;
                margin-bottom: 1rem;
            }

            .testimonial-author {
                display: flex;
                flex-direction: column;
                color: var(--text-light);
            }

            /* Footer Styles */
            footer {
                background-color: var(--bg-alt);
                color: var(--text-color);
                padding: 3rem 5% 1rem;
            }

            .footer-content {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                margin-bottom: 2rem;
            }

            .footer-logo h2 {
                font-size: 1.8rem;
                color: var(--primary-color);
                margin-bottom: 0.5rem;
            }

            .footer-logo p {
                color: var(--text-light);
            }

            .footer-links {
                display: flex;
                flex-wrap: wrap;
                gap: 3rem;
            }

            .link-group h3 {
                font-size: 1.2rem;
                margin-bottom: 1rem;
                color: var(--text-color);
                position: relative;
            }

            .link-group h3::after {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 0;
                width: 30px;
                height: 2px;
                background-color: var(--accent-color);
            }

            .link-group ul {
                list-style: none;
                padding: 0;
            }

            .link-group li {
                margin-bottom: 0.5rem;
            }

            .link-group a {
                color: var(--text-light);
                text-decoration: none;
                transition: color 0.2s ease;
            }

            .link-group a:hover {
                color: var(--primary-color);
            }

            .copyright {
                text-align: center;
                padding-top: 1.5rem;
                border-top: 1px solid var(--border-color);
                color: var(--text-light);
                font-size: 0.9rem;
            }

            /* Responsive Styles */
            @media (max-width: 992px) {
                .hero {
                    flex-direction: column;
                    text-align: center;
                    gap: 2rem;
                }

                .hero-content {
                    max-width: 100%;
                }

                .hero-buttons {
                    justify-content: center;
                }

                .footer-content {
                    flex-direction: column;
                    gap: 2rem;
                }

                .footer-links {
                    justify-content: space-between;
                }
            }

            @media (max-width: 768px) {
                header {
                    flex-direction: column;
                    padding: 1rem;
                    gap: 1rem;
                }

                .hero-content h1 {
                    font-size: 2.2rem;
                }

                .hero-content h2 {
                    font-size: 1.3rem;
                }

                .feature-cards,
                .role-cards,
                .testimonial-cards {
                    grid-template-columns: 1fr;
                }

                .footer-links {
                    flex-direction: column;
                    gap: 2rem;
                }
            }
        `
    ]
})
export class HomeBody implements OnInit {
    isDarkMode = false;
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
