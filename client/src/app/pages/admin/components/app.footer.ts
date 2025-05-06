import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        <a href="http://localhost:4200" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Medicare</a>
    </div>`
})
export class AppFooter {}
