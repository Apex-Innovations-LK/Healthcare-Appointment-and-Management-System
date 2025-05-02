import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'app-staff-schedule',
    imports: [ButtonModule, RippleModule, RouterModule, ButtonModule,],
    standalone: true,
    template: `<div class="bg-surface-0 dark:bg-surface-900">
        <div id="home" class="landing-wrapper overflow-hidden">
            <div><h1>Staff Schedule Works!</h1></div>
        </div>
    </div> `
})
export class Schedule {}
