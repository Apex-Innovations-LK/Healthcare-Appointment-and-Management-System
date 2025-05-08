import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ResourceAllocationService } from './services/resourceAllocation.service';
import { TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';



@Component({
    selector: 'resource-allocation-dashboard',
    standalone: true,
    imports: [ButtonModule , TableModule ,DatePipe],
    templateUrl: './resourceAllocation.html',
})
export class ResourceAllocation implements OnInit{

    resourceAllocations: ResourceAllocation[] = [];
    loading : boolean = true;

    constructor(
        private router: Router,
        private resourceAllocationService: ResourceAllocationService,   
    ) { }

    ngOnInit(): void {
        this.resourceAllocationService.getAllResourceAllocations().subscribe(
            (data) => {
                this.resourceAllocations = data.map((record: any) => ({
                    ...record,
                    from: new Date(record.from),
                    to: new Date(record.to),
                }));
                console.log(this.resourceAllocations);
                this.loading = false
            }
        );
    }

    navigateToAddNewResource(){
        // Logic to navigate to the Add New Resource page
        // console.log("Navigating to Add New Resource page...");
        // You can use Angular Router for navigation if needed
        this.router.navigate(['/admin/resource-allocation/resources']);
    }

    goToResourceAllocationDetail(record : any){
        this.router.navigate(['/admin/resource-allocation/resource-allocation-detail', record.sessionId]);
        console.log(record);
    }

}