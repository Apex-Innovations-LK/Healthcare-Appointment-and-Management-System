import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'patient-aboutus-widget',
    standalone: true,
    imports: [ButtonModule, RippleModule],
    template: `
        <div id="aboutus" class="py-12 px-6 lg:px-20 mx-0 my-16 lg:mx-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl">
            <div class="text-center mb-16 relative">
                <div class="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 rounded-full blur-3xl opacity-30"></div>
                <div class="relative">
                    <div class="text-surface-900 dark:text-surface-0 font-bold mb-4 text-5xl animate-fade-in">About Us</div>
                    <span class="text-muted-color text-2xl block max-w-3xl mx-auto animate-fade-in-delay">Welcome to Medicare. Your trusted partner in compassionate and quality healthcare.</span>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 my-12">
                <!-- Vision Card -->
                <div class="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 border-l-4 border-primary transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-primary-600 group">
                    <div class="flex items-center mb-6">
                        <span class="bg-primary-100 text-primary p-3 rounded-full group-hover:bg-primary-200 transition-colors duration-300">
                            <i class="pi pi-eye text-2xl"></i>
                        </span>
                        <h2 class="text-3xl font-bold text-primary ml-4 group-hover:text-primary-600 transition-colors duration-300">VISION</h2>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                        <em class="text-xl block mb-4 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 transition-colors duration-300">"To Be the Hospital of Tomorrow"</em>
                        To provide quality and safe healthcare to the people whilst maintaining leadership and excellence in the healthcare facility.
                    </p>
                </div>

                <!-- Mission Card -->
                <div class="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 border-l-4 border-primary transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-primary-600 group">
                    <div class="flex items-center mb-6">
                        <span class="bg-primary-100 text-primary p-3 rounded-full group-hover:bg-primary-200 transition-colors duration-300">
                            <i class="pi pi-heart-fill text-2xl"></i>
                        </span>
                        <h2 class="text-3xl font-bold text-primary ml-4 group-hover:text-primary-600 transition-colors duration-300">MISSION</h2>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                        <em class="text-xl block mb-4 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 transition-colors duration-300">"Healing with Feeling"</em>
                        To provide the best quality healthcare in accordance with international standards to the needy in a cost effective, timely and professional manner.
                    </p>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-10 border-l-4 border-primary mt-12 transform transition-all duration-500 hover:shadow-2xl hover:border-primary-600 group">
                <p class="text-gray-700 dark:text-gray-300 text-lg text-center leading-relaxed max-w-4xl mx-auto">
                    Medicare is a modern healthcare and appointment management system dedicated to improving the way patients and medical professionals connect. With the vision of "Being the Hospital of Tomorrow", Medicare offers a seamless digital
                    platform for scheduling, managing, and optimizing healthcare services. Our mission "Healing with Feeling" drives our commitment to deliver high-quality, accessible, and affordable care through technology. Designed for hospitals,
                    clinics, and healthcare providers, Medicare ensures efficient appointment booking, staff coordination, and real-time access to patient data—making healthcare delivery faster, safer, and more patient-focused. Built on the pillars
                    of quality, innovation, and compassion, Medicare empowers medical teams and supports long-term sustainability in healthcare operations. We aim to set a new standard for healthcare management by combining clinical excellence with
                    user-friendly digital solutions.
                </p>
            </div>
        </div>
    `,
    styles: [`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-fade-in-delay {
            animation: fadeIn 0.8s ease-out 0.3s forwards;
            opacity: 0;
        }
    `]
})
export class AboutusWidget {}
