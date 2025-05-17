import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Main',
                items: [
                    { 
                        label: 'Dashboard', 
                        icon: 'pi pi-fw pi-home', 
                        routerLink: ['/admin'] 
                    }
                ]
            },
            {
                label: 'Analytics',
                items: [
                    {
                        label: 'Health Metrics',
                        icon: 'pi pi-chart-line',
                        routerLink: ['/admin/analytics']
                    },
                    {
                        label: 'Risk Distribution',
                        icon: 'pi pi-chart-pie',
                        routerLink: ['/admin/risk-distribution']
                    }
                ]
            },
            {
                label: 'Reporting',
                items: [
                    {
                        label: 'Report Builder',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['/admin/report-builder']
                    },
                    {
                        label: 'Visualizer',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/admin/report-visualizer']
                    }
                ]
            },
            {
                label: 'Patient Management',
                items: [
                    {
                        label: 'Patient Risk Assessment',
                        icon: 'pi pi-users',
                        routerLink: ['/admin/patients']
                    },
                    {
                        label: 'Schedule',
                        icon: 'pi pi-calendar',
                        routerLink: ['/admin/schedular']
                    }
                ]
            },
            {
                label: 'Resource Management',
                icon: 'pi pi-cogs', // Represents system/resource settings
                items: [
                    {
                        label: 'Manage Resources',
                        icon: 'pi pi-database', // Represents data/resources
                        routerLink: ['/admin/resource-allocation'],
                        tooltip: 'Add resources, assign them to sessions, and view resource details'
                    },
                    {
                        label: 'Staff Utilization',
                        icon: 'pi pi-chart-line', // Represents analytics or tracking
                        routerLink: ['/admin/staff-utilization'],
                        tooltip: 'View staff utilization reports and analytics'
                    }
                ]
            }

        ];
    }
}
