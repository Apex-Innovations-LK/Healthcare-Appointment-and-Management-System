import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';


@Component({
    selector: 'app-patient-appointment',
    standalone: true,
    imports: [RouterModule, RippleModule, StyleClassModule, ButtonModule, DividerModule],
    template: `<div class="bg-surface-0 dark:bg-surface-900">
        <div id="home" class="landing-wrapper overflow-hidden">
           <div><h1>Appointment Works!</h1></div>
        </div>
    </div> `
})
export class Appointment {}



// <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />
            