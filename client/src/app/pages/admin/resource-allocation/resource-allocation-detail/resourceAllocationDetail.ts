import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionResourceDetail } from './models/sessionResourceDetail.model';
import { SessionResourceDetailService } from './services/sessionResourceDetail.service';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { Resource } from '../resources/models/resource.model';


@Component({
    selector: 'app-resource-allocation-detail',
    imports: [DatePipe,TableModule,ButtonModule],
    templateUrl: './resourceAllocationDetail.html',
})
export class ResourceAllocationDetail implements OnInit {
    // Component logic goes here

    sessionId!: string;

    sessionResourceDetail!: SessionResourceDetail ; // Initialize with null or appropriate type
    resources! : Resource[];
    loading: boolean = true;

    constructor( 
        private route: ActivatedRoute , 
        private sessionResourceDetailService: SessionResourceDetailService, // Assuming you have a service to fetch session resource details
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.sessionId = this.route.snapshot.paramMap.get('id')!;
        
        this.sessionResourceDetailService.getSessionResourceDetail(this.sessionId).subscribe(
            (data) => {
                this.sessionResourceDetail = data;
                this.resources = data.resources;
                this.loading = false;
                console.log(this.sessionResourceDetail);
            },
            (error) => {
                console.error('Error fetching session resource detail:', error);
            }
        );
    }

    allocateNewResource() {
        // Logic to allocate a new resource
        // console.log('Allocating new resource:', record);
        // You can implement the logic to allocate a new resource here

    }

    handleGoBack(){
        this.router.navigate(['/admin/resource-allocation']);
    }

}