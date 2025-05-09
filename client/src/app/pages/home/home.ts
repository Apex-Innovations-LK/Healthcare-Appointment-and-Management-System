import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { TopbarWidget } from "./components/topbarwidget.component";
import { HomeBody } from "./components/homeBody";
import { FooterWidget } from "./components/footerwidget";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule, DividerModule, InputSwitchModule, FormsModule, ImageModule, TopbarWidget, HomeBody, FooterWidget],
    template: `
        <div>
            <home-topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static"></home-topbar-widget>
            <app-home-body></app-home-body>
            <home-footer-widget></home-footer-widget>
        </div>
    `
})
export class HomeComponent {
    constructor() { }

}
