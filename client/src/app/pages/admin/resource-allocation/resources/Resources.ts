import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';

import { Table, TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';





import { Resource } from './models/resource.model';
import { ResourceService } from './services/resource.service';
import { Router } from '@angular/router';


@Component({
    selector: 'resources',
    standalone: true,
    imports: [InputTextModule, FluidModule, ButtonModule, SelectModule, FormsModule, TextareaModule,CommonModule , TableModule ,MultiSelectModule,TagModule],
    templateUrl: './Resources.html',
})
export class Resources implements OnInit {

    typeItems = [
        { name: 'Room', code: 'Room' },
        { name: 'Equipment', code: 'Equipment' },
        // { name: 'Option 3', code: 'Option 3' }
    ];

    typeItem = {name:'', code: ''};

    departmentItems = [
        { name: 'Emergency', code: 'Emergency' },
        { name: 'Surgery', code: 'Surgery' },
        { name: 'Cardiology', code: 'Cardiology' },
        { name: 'Radiology', code: 'Radiology' },
        { name: 'Pediatrics', code: 'Pediatrics' },
        { name: 'General Medicine', code: 'General Medicine' },
        { name: 'Orthopedics', code: 'Orthopedics' },
        { name: 'Neurology', code: 'Neurology' },
        // { name: 'Option 3', code: 'Option 3' }
    ];

    departmentItem = {name:'', code: ''};

    showForm: boolean = false;

    resources: Resource[] = [];

    statusItems = [
        { name: 'Available', code: 'Available' },
        { name: 'Busy', code: 'Busy' },
        { name: 'Under Maintenance', code: 'Under Maintenance' },
        { name: 'Out of Service', code: 'Out of Service' }
        // { name: 'Option 3', code: 'Option 3' }
    ];

    loading: boolean = true;

    @ViewChild('filter') filter!: ElementRef;

    constructor( 
        private resourceService: ResourceService,
        private router: Router,
     ) { }

    ngOnInit(): void {
        this.resourceService.getResources().subscribe(
            (data) => {
                this.resources = data.map((record: any) => ({
                    ...record,
                    createdTime: new Date(record.createdTime),
                }));
                this.loading = false;
                // console.log("Resources fetched successfully:", this.resources);
            }
        );
    }
    onSubmit() {
        const name = (document.getElementById('name') as HTMLInputElement).value.trim();
        const description = (document.getElementById('description') as HTMLTextAreaElement).value.trim();
    
        if (!name || !this.typeItem || !this.departmentItem || !description) {
          alert('Please fill in all fields before submitting.');
          return;
        }
    
        const newResource : any = {
          name: name,
          type: this.typeItem.name,
          department: this.departmentItem.name,
          description : description,
        };

        this.resourceService.addResource(newResource).subscribe(
            (response) => {
                console.log("Resource added successfully:", response);

                this.resources = [...this.resources, {
                    ...response,
                    createdTime: new Date(response.createdTime)  // handle createdTime if backend sends it
                }];

                console.log("Updated resources:", this.resources);

            },
            (error) => {
                console.error("Error adding resource:", error);
            }

        );
        this.showForm = false; // Hide the form after submission
        // console.log('Submit button pressed');
        // console.log('New Resource:', newResource);
      }

      handleShowForm(){
        this.showForm = !this.showForm;
        console.log(this.showForm);
      }

      goToResourceDetail(record : any) {
        this.router.navigate(['admin/resource-allocation/resource', record.resourceId]);
        //console.log("Go to detail of resource:", record);
      }
      handleBackToDashboard() {
        this.router.navigate(['admin/resource-allocation']);
        //console.log("Go to detail of resource:", record);
      }

}