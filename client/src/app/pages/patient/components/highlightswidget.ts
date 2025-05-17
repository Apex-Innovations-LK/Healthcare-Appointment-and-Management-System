import { Component } from '@angular/core';

@Component({
    selector: 'patient-highlights-widget',
    template: `
        <div id="highlights" class="py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
            <div class="text-center">
                <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Your Health, Your Schedule</div>
                <span class="text-muted-color text-2xl">Easily book, manage, and track appointments — all in one place.</span>
            </div>

            <div class="grid grid-cols-12 gap-4 mt-20 pb-2 md:pb-10">
                <div class="flex justify-center items-center col-span-12 lg:col-span-6 bg-white p-0 order-1 lg:order-none rounded-lg overflow-hidden dark:bg-gray-900">
                    <img src="assets/images/appointment_booking.png" class="w-full h-auto object-contain" alt="Book appointments" />
                </div>

                <div class="col-span-12 lg:col-span-6 my-auto flex flex-col lg:items-end text-center lg:text-right gap-4">
                    <div class="flex items-center justify-center bg-primary-100  self-center lg:self-end" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                        <i class="pi pi-fw pi-calendar-plus !text-4xl text-primary"></i>
                    </div>
                    <div class="leading-none text-surface-900 dark:text-surface-0 text-3xl font-normal">Book Appointments Easily</div>
                    <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal ml-0 md:ml-2" style="max-width: 650px"> Choose your preferred doctor and time slot in seconds. No long queues or calls — just a few taps. </span>
                </div>
            </div>

            <div class="grid grid-cols-12 gap-4 my-10 pt-2 md:pt-10">
                <div class="col-span-12 lg:col-span-6 my-auto flex flex-col text-center lg:text-left lg:items-start gap-4">
                    <div class="flex items-center justify-center bg-primary-100  self-center lg:self-start" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                        <i class="pi pi-fw pi-clock !text-3xl text-primary"></i>
                    </div>
                    <div class="leading-none text-surface-900 dark:text-surface-0 text-3xl font-normal">Track Appointments in Real-Time</div>
                    <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal mr-0 md:mr-2" style="max-width: 650px"> Get notified when your appointment is scheduled, rescheduled, or canceled. Stay informed, always. </span>
                </div>

                <div class="flex justify-end order-1 sm:order-2 col-span-12 lg:col-span-6 bg-white p-0 dark:bg-gray-900" style="border-radius: 8px">
                    <img src="assets/images/appointment_tracking.png" class="w-full h-auto onject-contain" alt="Track appointments" />
                </div>
            </div>

            <div class="grid grid-cols-12 gap-4 my-10 pt-2">
                <div class="flex justify-center col-span-12 lg:col-span-6 dark:bg-gray-900 bg-white p-0 order-1 lg:order-none" style="border-radius: 8px">
                    <img src="assets/images/doctor_patient.png" class="w-full h-auto onject-contain" alt="Doctor profiles" />
                </div>

                <div class="col-span-12 lg:col-span-6 my-auto flex flex-col lg:items-end text-center lg:text-right gap-4">
                    <div class="flex items-center justify-center bg-primary-100 self-center lg:self-end" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                        <i class="pi pi-fw pi-user !text-4xl text-primary"></i>
                    </div>
                    <div class="leading-none text-surface-900 dark:text-surface-0 text-3xl font-normal">Trusted Doctors, Transparent Profiles</div>
                    <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal ml-0 md:ml-2" style="max-width: 650px"> View credentials, specialties, and availability before you book. Feel confident in every choice. </span>
                </div>
            </div>
        </div>
    `
})
export class HighlightsWidget {}
