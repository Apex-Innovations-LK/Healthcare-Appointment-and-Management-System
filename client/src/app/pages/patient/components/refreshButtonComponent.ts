import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-refresh-button',
    standalone: true,
    template: ` <button pButton icon="pi pi-refresh" label="Refresh" (click)="refreshPage()" ></button> `
})
export class RefreshButtonComponent {
    constructor(private router: Router) {}

    refreshPage() {
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
        });
    }
}
