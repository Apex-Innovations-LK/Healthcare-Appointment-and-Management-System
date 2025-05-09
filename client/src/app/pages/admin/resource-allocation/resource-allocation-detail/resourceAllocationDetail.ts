import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionResourceDetail } from './models/sessionResourceDetail.model';
import { SessionResourceDetailService } from './services/sessionResourceDetail.service';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { Resource } from '../resources/models/resource.model';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

import { AvailableResources } from './models/availableResources.model'; // Adjust the import path as necessary



@Component({
    selector: 'app-resource-allocation-detail',
    imports: [DatePipe,TableModule,ButtonModule,SelectModule,FormsModule],
    templateUrl: './resourceAllocationDetail.html',
})
export class ResourceAllocationDetail implements OnInit {
    // Component logic goes here

    sessionId!: string;

    sessionResourceDetail!: SessionResourceDetail ; // Initialize with null or appropriate type
    resources! : Resource[];
    loading: boolean = true;

    typeItems = [
        { name: 'Room', code: 'Room' },
        { name: 'Equipment', code: 'Equipment' },
        // { name: 'Option 3', code: 'Option 3' }
    ];

    typeItem = {name:'', code: ''};
    roomItems = [
        {name:'', code: ''}
    ];

    equipmentItems = [
        {name:'', code: ''}
    ];

    resourceItem = {name:'', code: ''};

    availableResources!: AvailableResources; // Initialize with an empty array or appropriate type

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
                // console.log(this.sessionResourceDetail);
                const fromDate = new Date(this.sessionResourceDetail.from);
                const toDate = new Date(this.sessionResourceDetail.to);

                const fromISO = fromDate.toISOString();
                const toISO = toDate.toISOString();

                this.sessionResourceDetailService.getAvailableResources(fromISO, toISO).subscribe(
                    (data) => {
                        this.availableResources = data;
                        this.roomItems = this.availableResources.room.map((room: Resource) => ({
                            name: `${room.name} - ${room.description} (${room.department})`,
                            code: room.resourceId
                        }));
                        this.equipmentItems = this.availableResources.equipment.map((room: Resource) => ({
                            name: `${room.name} - ${room.description} (${room.department})`,
                            code: room.resourceId
                        }));
                        console.log(this.availableResources);
                    },
                    (error) => {
                        console.error('Error fetching available resources:', error);
                    }
                );
            },
            (error) => {
                // console.error('Error fetching session resource detail:', error);
            }
        );


        // this.sessionResourceDetailService.getAvailableResources(this.sessionResourceDetail.from.toISOString(), this.sessionResourceDetail.to.toISOString()).subscribe(
        //     (data) => {
        //         this.availableResources = data;
        //         console.log(this.availableResources);
        //     },
        //     (error) => {
        //         console.error('Error fetching available resources:', error);
        //     }
        // );

    }

    allocateNewResource() {
        if (this.resourceItem.code == '') {
            alert('Please select a resource before submitting.');
            return;
        }
        
        this.loading = true; // Set loading to true before making the API call

        const newResourceAllocation: any = {
            sessionId: this.sessionId,
            resourceId: this.resourceItem.code,
            from: this.sessionResourceDetail.from,
            to: this.sessionResourceDetail.to
        };
    
        this.sessionResourceDetailService.addResourceToSession(newResourceAllocation).subscribe(
            () => {
                // ✅ Refresh the session details to update the resource list
                this.sessionResourceDetailService.getSessionResourceDetail(this.sessionId).subscribe(
                    (data) => {
                        this.sessionResourceDetail = data;
                        this.resources = data.resources;
                        this.loading = false;
                        // console.log(this.sessionResourceDetail);
                        const fromDate = new Date(this.sessionResourceDetail.from);
                        const toDate = new Date(this.sessionResourceDetail.to);
        
                        const fromISO = fromDate.toISOString();
                        const toISO = toDate.toISOString();
        
                        this.sessionResourceDetailService.getAvailableResources(fromISO, toISO).subscribe(
                            (data) => {
                                this.availableResources = data;
                                this.roomItems = this.availableResources.room.map((room: Resource) => ({
                                    name: `${room.name} - ${room.description} (${room.department})`,
                                    code: room.resourceId
                                }));
                                this.equipmentItems = this.availableResources.equipment.map((room: Resource) => ({
                                    name: `${room.name} - ${room.description} (${room.department})`,
                                    code: room.resourceId
                                }));
                                console.log(this.availableResources);
                            },
                            (error) => {
                                console.error('Error fetching available resources:', error);
                            }
                        );
                    },
                    (error) => {
                        // console.error('Error fetching session resource detail:', error);
                    }
                );
                this.loading = false; // Set loading to false after the API call is complete
                this.resourceItem = {name:'', code: ''}; // Reset the selected resource
                this.typeItem = {name:'', code: ''}; // Reset the selected resource type
            },
            (error) => {
                console.error('Error allocating resource:', error);
                this.loading = false;
                this.resourceItem = {name:'', code: ''};
                this.typeItem = {name:'', code: ''}; // Reset the selected resource type
            }

        );
    }
    
    removeResourceAllocation(record : Resource){ 
        this.sessionResourceDetailService.deleteResourceFromSession(this.sessionId , record.resourceId).subscribe(
            () => {
                // ✅ Refresh the session details to update the resource list
                this.sessionResourceDetailService.getSessionResourceDetail(this.sessionId).subscribe(
                    (data) => {
                        this.sessionResourceDetail = data;
                        this.resources = data.resources;
                        this.loading = false;
                        // console.log(this.sessionResourceDetail);
                        const fromDate = new Date(this.sessionResourceDetail.from);
                        const toDate = new Date(this.sessionResourceDetail.to);
        
                        const fromISO = fromDate.toISOString();
                        const toISO = toDate.toISOString();
        
                        this.sessionResourceDetailService.getAvailableResources(fromISO, toISO).subscribe(
                            (data) => {
                                this.availableResources = data;
                                this.roomItems = this.availableResources.room.map((room: Resource) => ({
                                    name: `${room.name} - ${room.description} (${room.department})`,
                                    code: room.resourceId
                                }));
                                this.equipmentItems = this.availableResources.equipment.map((room: Resource) => ({
                                    name: `${room.name} - ${room.description} (${room.department})`,
                                    code: room.resourceId
                                }));
                                // console.log(this.availableResources);
                            },
                            (error) => {
                                console.error('Error fetching available resources:', error);
                            }
                        );
                    },
                    (error) => {
                        // console.error('Error fetching session resource detail:', error);
                    }
                );
                this.loading = false; // Set loading to false after the API call is complete
                this.resourceItem = {name:'', code: ''}; // Reset the selected resource
                this.typeItem = {name:'', code: ''}; // Reset the selected resource type
            },
            (error) => {
                // console.error('Error allocating resource:', error);
                this.loading = false;
                this.resourceItem = {name:'', code: ''};
                this.typeItem = {name:'', code: ''}; // Reset the selected resource type
            }
        );
    }

    handleGoBack(){
        this.router.navigate(['/admin/resource-allocation']);
    }



}