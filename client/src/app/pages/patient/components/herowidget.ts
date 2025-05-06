import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'patient-hero-widget',
    standalone: true,
    imports: [ButtonModule, RippleModule],
    template: `
        <div id="hero" class="relative flex flex-col justify-center pt-6 px-6 lg:px-20 h-[600px] text-white overflow-hidden" style="background-image: url('assets/images/Home_bg.jpg'); background-size: cover; background-position: center;">
            <div class="relative z-10 max-w-4xl">
                <h1 class="text-5xl md:text-6xl font-bold leading-tight text-white drop-shadow-md"><span class="font-light block">Welcome!</span>Your health journey starts here.</h1>
                <p class="text-2xl mt-4 text-white drop-shadow-sm">Access appointments, medical records, and personalized care.</p>
            </div>
            <div class="absolute inset-0 bg-black opacity-30 z-0"></div>
        </div>
    `
})
export class HeroWidget {}
