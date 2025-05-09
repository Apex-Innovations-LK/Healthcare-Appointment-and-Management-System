import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { HeroWidget } from '../staff/components/herowidget';
import { HighlightsWidget } from "./components/highlightsWidget";

@Component({
    selector: 'app-staff',
    standalone: true,
    imports: [RouterModule, RippleModule, StyleClassModule, ButtonModule, DividerModule, HeroWidget, HighlightsWidget],
    template: `
        <div class="bg-surface-0 dark:bg-surface-900">
            <div id="home" class="landing-wrapper overflow-hidden">
                <staff-hero-widget />
                <staff-highlights-widget />
            </div>
        </div>
    `
})
export class Staff {}
