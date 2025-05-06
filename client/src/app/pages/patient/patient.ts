import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { HeroWidget } from './components/herowidget';
import { HighlightsWidget } from './components/highlightswidget';
import { AboutusWidget } from "./components/aboutuswidget";
import { ContactusWidget } from "./components/contactuswidget";

@Component({
    selector: 'app-patient',
    standalone: true,
    imports: [RouterModule, HeroWidget, HighlightsWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule, AboutusWidget, ContactusWidget],
    template: `
        <div class="bg-surface-0 dark:bg-surface-900">
            <div id="home" class="landing-wrapper overflow-hidden">
                <patient-hero-widget />
                <patient-highlights-widget />
                <patient-aboutus-widget />
                <patient-contactus-widget />
            </div>
        </div>
    `
})
export class Patient {}
