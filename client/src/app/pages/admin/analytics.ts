import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from './service/admin.patient.analytics';
import { Subscription } from 'rxjs';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { FluidModule } from 'primeng/fluid';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule, ChartModule, FluidModule],
  template: `
    <p-fluid class="grid grid-cols-12 gap-8">
      <div class="col-span-12 xl:col-span-6">
        <div class="card">
          <div class="font-semibold text-xl mb-4">Linear</div>
          <p-chart type="line" [data]="lineData" [options]="lineOptions"></p-chart>
        </div>
      </div>

      <div class="col-span-12 xl:col-span-6">
        <div class="card">
          <div class="font-semibold text-xl mb-4">Bar</div>
          <p-chart type="bar" [data]="barData" [options]="barOptions"></p-chart>
        </div>
      </div>

      <div class="col-span-12 xl:col-span-6">
        <div class="card flex flex-col items-center">
          <div class="font-semibold text-xl mb-4">Pie</div>
          <p-chart type="pie" [data]="pieData" [options]="pieOptions"></p-chart>
        </div>
      </div>

      <div class="col-span-12 xl:col-span-6">
        <div class="card flex flex-col items-center">
          <div class="font-semibold text-xl mb-4">Doughnut</div>
          <p-chart type="doughnut" [data]="pieData" [options]="pieOptions"></p-chart>
        </div>
      </div>

      <div class="col-span-12 xl:col-span-6">
        <div class="card flex flex-col items-center">
          <div class="font-semibold text-xl mb-4">Polar Area</div>
          <p-chart type="polarArea" [data]="polarData" [options]="polarOptions"></p-chart>
        </div>
      </div>

      <div class="col-span-12 xl:col-span-6">
        <div class="card flex flex-col items-center">
          <div class="font-semibold text-xl mb-4">Radar</div>
          <p-chart type="radar" [data]="radarData" [options]="radarOptions"></p-chart>
        </div>
      </div>
    </p-fluid>
  `,
})
export class Analytics implements OnInit, OnDestroy {
  lineData: any;
  barData: any;
  pieData: any;
  polarData: any;
  radarData: any;
  lineOptions: any;
  barOptions: any;
  pieOptions: any;
  polarOptions: any;
  radarOptions: any;
  subscription: Subscription | undefined;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadAnalyticsData();
  }

  // Load data from backend and initialize charts
  loadAnalyticsData() {
    this.analyticsService.getAnalyticsData().subscribe(data => {
      this.initializeCharts(data); // Pass the fetched data to initialize charts
    });
  }

  // Initialize charts with the received data
  initializeCharts(data: any) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    // Line Chart Data
    this.lineData = {
      labels: data.map((record: any) => record.patient_name), // Patient names as labels
      datasets: [
        {
          label: 'Patient Risk Score',
          data: data.map((record: any) => record.riskCategory), // Assuming backend adds 'riskCategory'
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
          borderColor: documentStyle.getPropertyValue('--p-primary-500'),
          tension: 0.4
        }
      ]
    };

    // Line Chart Options
    this.lineOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: { color: textColor }
        }
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder, drawBorder: false }
        },
        y: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder, drawBorder: false }
        }
      }
    };

    // Bar Chart Data
    this.barData = {
      labels: data.map((record: any) => record.patient_name), // Patient names as labels
      datasets: [
        {
          label: 'Medication Usage',
          backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
          borderColor: documentStyle.getPropertyValue('--p-primary-200'),
          data: data.map((record: any) => record.medications.length), // Count medications per patient
        }
      ]
    };

    // Bar Chart Options
    this.barOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: { color: textColor }
        }
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { display: false, drawBorder: false }
        },
        y: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder, drawBorder: false }
        }
      }
    };

    // Pie Chart Data
    this.pieData = {
      labels: ['Asthma', 'Hypertension', 'Diabetes'],
      datasets: [
        {
          data: [30, 50, 20], // Example: Percentage of patients with each condition
          backgroundColor: [
            documentStyle.getPropertyValue('--p-indigo-500'),
            documentStyle.getPropertyValue('--p-purple-500'),
            documentStyle.getPropertyValue('--p-teal-500')
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--p-indigo-400'),
            documentStyle.getPropertyValue('--p-purple-400'),
            documentStyle.getPropertyValue('--p-teal-400')
          ]
        }
      ]
    };

    // Pie Chart Options
    this.pieOptions = {
      plugins: {
        legend: {
          labels: { usePointStyle: true, color: textColor }
        }
      }
    };

    // Polar Area Chart Data
    this.polarData = {
      datasets: [
        {
          data: [60, 30, 10], // Example: Polar chart for specific metrics
          backgroundColor: [
            documentStyle.getPropertyValue('--p-indigo-500'),
            documentStyle.getPropertyValue('--p-purple-500'),
            documentStyle.getPropertyValue('--p-teal-500')
          ],
          label: 'Patient Health Conditions'
        }
      ],
      labels: ['Condition A', 'Condition B', 'Condition C']
    };

    // Polar Area Chart Options
    this.polarOptions = {
      plugins: {
        legend: {
          labels: { color: textColor }
        }
      },
      scales: {
        r: {
          grid: { color: surfaceBorder },
          ticks: { display: false, color: textColorSecondary }
        }
      }
    };

    // Radar Chart Data
    this.radarData = {
      labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
      datasets: [
        {
          label: 'Patient Lifestyle',
          borderColor: documentStyle.getPropertyValue('--p-indigo-400'),
          pointBackgroundColor: documentStyle.getPropertyValue('--p-indigo-400'),
          pointBorderColor: documentStyle.getPropertyValue('--p-indigo-400'),
          pointHoverBackgroundColor: textColor,
          pointHoverBorderColor: documentStyle.getPropertyValue('--p-indigo-400'),
          data: [65, 59, 90, 81, 56, 55, 40]
        }
      ]
    };

    // Radar Chart Options
    this.radarOptions = {
      plugins: {
        legend: {
          labels: { color: textColor }
        }
      },
      scales: {
        r: {
          pointLabels: { color: textColor },
          grid: { color: surfaceBorder }
        }
      }
    };
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
