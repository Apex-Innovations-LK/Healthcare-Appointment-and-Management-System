import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-schedular',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div>
            <h1>Schedular works!</h1>
        </div>
    `
})
export class Schedular {

}
