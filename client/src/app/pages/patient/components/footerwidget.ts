import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'patient-footer-widget',
    imports: [RouterModule],
    template: `
        <div class="layout-footer">
            <a href="http://localhost:4200" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Medicare</a>
        </div>
    `
})
export class FooterWidget {
    constructor(public router: Router) {}
}
