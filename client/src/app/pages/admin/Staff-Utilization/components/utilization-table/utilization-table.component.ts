import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';

import { ChartModule } from 'primeng/chart';

import { Router } from '@angular/router';



import { UtilizationService } from '../../services/utilization.service';
import { UtilizationRecord } from '../../models/utilization.model';

@Component({
    selector: 'utilization-table',
    standalone: true,
    imports: [
        TableModule,
        MultiSelectModule,
        SelectModule,
        InputIconModule,
        TagModule,
        InputTextModule,
        SliderModule,
        ProgressBarModule,
        ToggleButtonModule,
        ToastModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        RatingModule,
        RippleModule,
        IconFieldModule,
        ChartModule,
    ],
    templateUrl: './utilization-table.component.html',
    // template: `
    //     <div class="grid grid-cols-12 gap-8">
    //         <h1 class="col-span-12">Utilization Table</h1>
    //     </div>
    // `
})
export class UtilizationTable implements OnInit{

    barData = {
        labels: ['Doctors', 'Staff'],
        datasets: [
            {
                label: 'utilization',
                backgroundColor: '#42A5F5',
                borderColor: 'green',
                data: [0, 0]
            }
            // {
            //     label: 'My Second dataset',
            //     // backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
            //     // borderColor: documentStyle.getPropertyValue('--p-primary-200'),
            //     data: [28, 48, 40, 19, 86, 27, 90]
            // }
        ]
    };

    barOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    // color: textColor
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Role'
                },
                ticks: {
                    // color: '#42A5F5',
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Utilization (%)'
                },
                ticks: {
                    // color: textColorSecondary
                },
                grid: {
                    // color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };

    pieData = {
        labels: ["Low", "Normal", "High"],
        datasets: [
            {
                data: [0, 0, 0],
                backgroundColor: ['#42A5F5', '#66BB6A', '#EF5350'], // blue, green, red
                hoverBackgroundColor: ['#2196F3', '#43A047', '#E53935'] // darker variants
            }
        ]
    };    

    pieOptions = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    // color: textColor
                }
            }
        }
    };

    utilizationRecords: UtilizationRecord[] = [];
    avgUtilization: number = 0; // Average utilization percentage for all staff
    numberOfOverUsedStaff: number = 0; // Number of staff members with utilization above 80%
    totalStaffMembers: number = 0; // Total number of staff members

    roles: any[] = [
        { name: 'Doctor', code: 'DOC' },
        { name: 'Staff', code: 'STF' },
    ];

    loading: boolean = true;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private utilizationService: UtilizationService ,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.utilizationService.getUtilizationData().subscribe((data) => {
            this.utilizationRecords = data.map((record: any) => ({
                ...record,
                date: new Date(record.date)  // Convert date string to Date object
            }));
            this.loading = false;
        });        
        this.utilizationService.getStaffUtilizationOverall().subscribe((data) => {
            this.avgUtilization = data.avarageUtilization;
            this.numberOfOverUsedStaff = data.numberOfOverUsedStaff;
            this.totalStaffMembers = data.totalStaffMembers;
            this.barData = {
                labels: ['Doctors', 'Staff'],
                datasets: [
                    {
                        label: 'utilization',
                        backgroundColor: '#42A5F5',
                        borderColor: 'green',
                        data: [data.utilizationByRoleDoctor, data.utilizationByRoleStaff]
                    }
                ]
            };
            this.pieData = {
                labels: data.staffStateDestributionLebal as string[],
                datasets: [
                    {
                        data: data.staffStateDestribution,
                        backgroundColor: ['#42A5F5', '#66BB6A', '#EF5350'], // blue, green, red
                        hoverBackgroundColor: ['#2196F3', '#43A047', '#E53935'] // darker variants
                    }
                ]
            };    
            // console.log(this.barData.datasets[0].data);
        });
        
    }

    goToDetail(record : any) {
        // console.log(record.staffAllocationId , avgUtilization);
        this.router.navigate(['/admin/staff', record.staffAllocationId , this.avgUtilization]);
    }

}