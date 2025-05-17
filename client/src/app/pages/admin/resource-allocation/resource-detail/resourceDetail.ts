import { Component, OnInit } from "@angular/core";
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { Resource } from '../resources/models/resource.model'
import { ResourceService } from '../resources/services/resource.service'

import { ActivatedRoute, Router } from '@angular/router';



@Component({
    selector: 'app-resource-detail',
    imports: [ChartModule,ButtonModule],
    templateUrl: './resourceDetail.html'
})
export class ResourceDetail implements OnInit {

    lineData = {
        labels: ['2023-01-01', '2023-02-01', '2023-03-01', '2023-04-01', '2023-05-01', '2023-06-01', '2023-07-01'],
        datasets: [
            {
                label: 'Busy Hours',
                data: [8, 4, 2, 0, 6, 5, 3],
                fill: false,
                borderColor: '#4bc0c0',
                tension: 0.1
            },
        ]
    }
    lineOptions = {
        maintainAspectRatio: false,
            aspectRatio: 0.8,
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                }
            },
            scales: {
                x: {
                    ticks: {
                        // color: textColorSecondary
                    },
                    grid: {
                        // color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
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

    resource! : Resource ;
    resourceId!: number;

    constructor( 
        private resourceService: ResourceService,
        private router: Router,
        private route: ActivatedRoute ,
    ) {}

    ngOnInit(): void {
        this.resourceId = Number(this.route.snapshot.paramMap.get('id'));
        this.resourceService.getResourceById(this.resourceId).subscribe(
            (data) => {
                this.resource = data;
                console.log(this.resource);
            }
        );
    }

    handleGoBack(){
        this.router.navigate(['/admin/resource-allocation/resources']);
    }

    
}