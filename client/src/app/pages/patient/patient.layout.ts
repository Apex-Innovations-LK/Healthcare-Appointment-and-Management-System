// pages/doctor/doctor.layout.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarWidget } from './components/topbarwidget.component'; 
import { FooterWidget } from './components/footerwidget';

@Component({
    selector: 'app-patient-layout',
    standalone: true,
    imports: [TopbarWidget, FooterWidget, RouterOutlet, TopbarWidget, FooterWidget],
    template: `
        <patient-topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />
        <router-outlet></router-outlet>
        <patient-footer-widget />
    `
})
export class PatientLayout {}
