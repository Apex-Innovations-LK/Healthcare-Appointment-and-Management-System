import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart'; 

@Component({
  selector: 'app-patient-metrics-chart',
  standalone: true, 
  imports: [ChartModule], 
  templateUrl: './patient-metrics-chart.component.html',
  styleUrls: ['./patient-metrics-chart.component.css']
})
export class PatientMetricsChartComponent {

  // Define chart data and chart options
  chartData: any;
  chartOptions: any;

  constructor() { }

  ngOnInit(): void {
    // Initialize chartData and chartOptions here
    this.chartData = {
      labels: ['January', 'February', 'March', 'April', 'May'], // Example labels
      datasets: [
        {
          label: 'Patient Visits',
          data: [65, 59, 80, 81, 56],  // Example data points for patient visits
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.1
        }
      ]
    };

    // Chart options for customization
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Months'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Number of Visits'
          }
        }
      }
    };
  }
}
