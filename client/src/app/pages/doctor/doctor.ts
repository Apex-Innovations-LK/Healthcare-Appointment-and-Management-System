import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { HeroWidget } from './components/herowidget';
import { FeatureWidget } from './components/featurewidget';



@Component({
    selector: 'app-doctor',
    standalone: true,
    imports: [RouterModule, HeroWidget, FeatureWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule],
    template: `
        <div class="bg-surface-0 dark:bg-surface-900">
            <div id="home" class="landing-wrapper overflow-hidden">
                 <doctor-hero-widget />
                 <doctor-feature-widget />
            </div>
        </div>
    `
})
export class Doctor {}
