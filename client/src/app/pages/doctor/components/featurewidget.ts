import { Component } from '@angular/core';

@Component({
    selector: 'doctor-feature-widget',
    template: `
        <div id="highlights" class="py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
            <div class="text-center">
                <div class="text-surface-900 dark:text-surface-0 font-semibold mb-2 text-4xl">Smart Tools for Smarter Healthcare</div>
                <span class="text-muted-color text-2xl"> Seamlessly manage your appointments, patients, and time — all in one place. </span>
            </div>

            <div class="grid grid-cols-12 gap-4 mt-10 pb-2 md:pb-10">
                <div class="flex justify-center items-center col-span-12 lg:col-span-6 bg-white p-0 order-1 lg:order-none rounded-lg overflow-hidden dark:bg-gray-900">
                    <img src="assets/images/schedule_management.png" class="w-full h-auto object-contain" alt="Book appointments" />
                </div>

                <div class="col-span-12 lg:col-span-6 my-auto flex flex-col lg:items-end text-center lg:text-right gap-4">
                    <div class="flex items-center justify-center bg-primary-100 self-center lg:self-end" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                        <i class="pi pi-fw pi-calendar-plus !text-4xl text-primary"></i>
                    </div>
                    <div class="text-surface-900 dark:text-surface-0 text-3xl font-semibold">Streamlined Appointment Booking</div>
                    <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal ml-0 md:ml-2" style="max-width: 650px">
                        Book and manage appointments effortlessly. Assign slots, reduce no-shows, and stay in control of your schedule.
                    </span>
                </div>
            </div>

            <div class="grid grid-cols-12 gap-4 my-10 pt-2 md:pt-10">
                <div class="col-span-12 lg:col-span-6 my-auto flex flex-col text-center lg:text-left lg:items-start gap-4">
                    <div class="flex items-center justify-center bg-primary-100 self-center lg:self-start" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                        <i class="pi pi-fw pi-clock !text-3xl text-primary"></i>
                    </div>
                    <div class="text-surface-900 dark:text-surface-0 text-3xl font-semibold">Real-Time Scheduling Updates</div>
                    <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal mr-0 md:mr-2" style="max-width: 650px">
                        Get instant updates when appointments are added, rescheduled, or canceled. Stay on top of your day, always.
                    </span>
                </div>

                <div class="flex justify-end order-1 sm:order-2 col-span-12 lg:col-span-6 bg-white p-0 dark:bg-gray-900 rounded-lg">
                    <img src="assets/images/schedule_updates.png" class="w-full h-auto object-contain" alt="Track appointments" />
                </div>
            </div>
<!-- 
            <div class="grid grid-cols-12 gap-4 my-20 pt-2">
                <div class="flex justify-center col-span-12 lg:col-span-6 bg-purple-100 p-0 order-1 lg:order-none rounded-lg">
                    <img src="assets/images/doctor_patient.png" class="w-full h-auto object-contain" alt="Doctor profiles" />
                </div>

                <div class="col-span-12 lg:col-span-6 my-auto flex flex-col lg:items-end text-center lg:text-right gap-4">
                    <div class="flex items-center justify-center bg-primary-100 self-center lg:self-end" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                        <i class="pi pi-fw pi-user !text-4xl text-primary"></i>
                    </div>
                    <div class="text-surface-900 dark:text-surface-0 text-3xl font-semibold">Transparent Patient Interaction</div>
                    <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal ml-0 md:ml-2" style="max-width: 650px">
                        Access patient profiles, appointment history, and care notes — empowering you to deliver informed, personalized care.
                    </span>
                </div>
            </div> -->
        </div>
    `
})
export class FeatureWidget {}
