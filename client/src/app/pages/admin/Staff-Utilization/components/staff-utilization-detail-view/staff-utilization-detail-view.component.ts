import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ChartModule } from 'primeng/chart';



import { UtilizationService } from '../../services/utilization.service';
import { UtilizationRecord } from '../../models/utilization.model';


@Component({
    selector: 'app-staff-utilization-detail-view',
    imports: [
      CommonModule,
      ChartModule,
    ],
    templateUrl: './staff-utilization-detail-view.component.html',
    styleUrls: ['./staff-utilization-detail-view.component.css']
})
export class StaffUtilizationDetailViewComponent {
  // Add component logic here
  staffId!: string;
  utilizationRecord!: UtilizationRecord | null;

  avgUtilization: number = 77.81; // Average utilization percentage for all staff


  pieData: any;
  pieOptions: any;

  pieDataUtilization: any;
  pieOptionsUtilization: any;
  
  
  constructor(private route: ActivatedRoute , private utilizationService: UtilizationService) {}

  ngOnInit(): void {
    this.staffId = this.route.snapshot.paramMap.get('id')!;

    // Fetch the utilization record based on the staff ID
    this.utilizationService.getUtilizationDataById(this.staffId).subscribe((data) => {
      this.utilizationRecord = data || null;
    });
    //console.log(this.utilizationRecord);
    // You can now use `this.staffId` to fetch staff details from API or service

    this.pieData = {
      labels: ['Idle Time', 'Active Time'],
      datasets: [
          {
              data: [ this.utilizationRecord?.idle_time , this.utilizationRecord?.active_hours],
              // backgroundColor: [documentStyle.getPropertyValue('--p-indigo-500'), documentStyle.getPropertyValue('--p-purple-500'), documentStyle.getPropertyValue('--p-teal-500')],
              // hoverBackgroundColor: [documentStyle.getPropertyValue('--p-indigo-400'), documentStyle.getPropertyValue('--p-purple-400'), documentStyle.getPropertyValue('--p-teal-400')]
          }
      ]
    };

    this.pieOptions = {
      plugins: {
          legend: {
              labels: {
                  usePointStyle: true,
                  // color: textColor
              }
          }
      }
    };  

    this.pieDataUtilization = {
      labels: ['Average Staff', 'This Staff'],
      datasets: [
          {
              data: [ this.avgUtilization , this.utilizationRecord?.utilization],
              // backgroundColor: [documentStyle.getPropertyValue('--p-indigo-500'), documentStyle.getPropertyValue('--p-purple-500'), documentStyle.getPropertyValue('--p-teal-500')],
              // hoverBackgroundColor: [documentStyle.getPropertyValue('--p-indigo-400'), documentStyle.getPropertyValue('--p-purple-400'), documentStyle.getPropertyValue('--p-teal-400')]
          }
      ]
    };

    this.pieOptionsUtilization = {
      plugins: {
          legend: {
              labels: {
                  usePointStyle: true,
                  // color: textColor
              }
          }
      }
    };  
  }
}