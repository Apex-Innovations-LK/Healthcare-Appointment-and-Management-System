import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'patient-aboutus-widget',
    standalone: true,
    imports: [ButtonModule, RippleModule],
    template: `
        <div id="aboutus" class="py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
            <div class="text-center">
                <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">About Us</div>
                <span class="text-muted-color text-2xl">Welcome to Medicare. your trusted partner in compassionate and quality healthcare.</span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 my-12">
                <!-- Vision Card -->
                <div class="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-8 border-l-4 border-primary">
                    <div class="flex items-center mb-4">
                        <span class="bg-primary-100 text-primary p-2 rounded-full">
                            <i class="pi pi-eye text-xl"></i>
                        </span>
                        <h2 class="text-2xl font-bold text-primary ml-4">VISION</h2>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 font-medium">
                        <em>“To Be the Hospital of Tomorrow”</em><br />
                        To provide quality and safe healthcare to the people whilst maintaining leadership and excellence in the healthcare facility.
                    </p>
                </div>

                <!-- Mission Card -->
                <div class="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-8 border-l-4 border-primary">
                    <div class="flex items-center mb-4">
                        <span class="bg-primary-100 text-primary p-2 rounded-full">
                            <i class="pi pi-heart-fill text-xl"></i>
                        </span>
                        <h2 class="text-2xl font-bold text-primary ml-4">MISSION</h2>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 font-medium">
                        <em>“Healing with Feeling”</em><br />
                        To provide the best quality healthcare in accordance with international standards to the needy in a cost effective, timely and professional manner.
                    </p>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-8 border-l-4 border-primary">
                <p class="text-gray-700 dark:text-gray-300 font-medium text-center">
                    Medicare is a modern healthcare and appointment management system dedicated to improving the way patients and medical professionals connect. With the vision of “Being the Hospital of Tomorrow”, Medicare offers a seamless digital
                    platform for scheduling, managing, and optimizing healthcare services. Our mission “Healing with Feeling” drives our commitment to deliver high-quality, accessible, and affordable care through technology. Designed for hospitals,
                    clinics, and healthcare providers, Medicare ensures efficient appointment booking, staff coordination, and real-time access to patient data—making healthcare delivery faster, safer, and more patient-focused. Built on the pillars
                    of quality, innovation, and compassion, Medicare empowers medical teams and supports long-term sustainability in healthcare operations. We aim to set a new standard for healthcare management by combining clinical excellence with
                    user-friendly digital solutions.
                </p>
            </div>
        </div>
    `
})
export class AboutusWidget {}
