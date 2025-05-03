/* ---------------------------------------------------------
   Analytics dashboard component (PrimeNG + Chart.js)
   --------------------------------------------------------- */
   import { Component, OnDestroy, OnInit } from '@angular/core';
   import { CommonModule } from '@angular/common';
   import { Subscription } from 'rxjs';
   import { Chart, registerables, TooltipItem } from 'chart.js';
   import { ChartModule } from 'primeng/chart';
   import { FluidModule } from 'primeng/fluid';
   
   import {
     AnalyticsService,
     AnalyticsData,
     Point
   } from './service/admin.patient.analytics';
   
   /* Chart.js must know which controllers / elements to use */
   Chart.register(...registerables);
   
   @Component({
     selector   : 'app-admin-analytics',
     standalone : true,
     imports    : [CommonModule, ChartModule, FluidModule],
     templateUrl: './analytics.html'
   })
   export class Analytics implements OnInit, OnDestroy {
   
     /* Chart‑bound objects */
     lineData:  any; lineOpts:  any;
     barData:   any; barOpts:   any;
     pieData:   any; pieOpts:   any;
     radarData: any; radarOpts: any;
     polarData: any; polarOpts: any;
   
     private sub?: Subscription;
   
     constructor(private api: AnalyticsService) {}
   
     /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
     ngOnInit(): void {
       this.sub = this.api.getAnalyticsData().subscribe({
         next : res => this.initCharts(res),
         error: ()  => this.initCharts(this.emptyAnalytics()) // graceful fallback
       });
     }
   
     ngOnDestroy(): void { this.sub?.unsubscribe(); }
   
     /* ---------- build demo object if request fails ---------- */
     private emptyAnalytics(): AnalyticsData {
       return {
         patientCountTimeline : [],
         allergiesDistribution: {},
         problemListCounts    : {},
         problemListBySex     : {}
       };
     }
   
     /* ===============  CHART INITIALISATION  =============== */
     private initCharts(data: AnalyticsData): void {
   
       /* ~~ css colours ~~ */
       const css   = getComputedStyle(document.documentElement);
       const txt   = css.getPropertyValue('--text-color');
       const txt2  = css.getPropertyValue('--text-color-secondary');
       const border= css.getPropertyValue('--surface-border');
       const prim  = css.getPropertyValue('--p-primary-500');
       const prim2 = css.getPropertyValue('--p-primary-300');
   
       /* --------------------------------------------------
          LINE CHART  ‑ Patient count over time
          -------------------------------------------------- */
       const timeline: Point[] = data.patientCountTimeline;
       this.lineData = {
         labels   : timeline.map(p => p.date),
         datasets : [{
           label           : 'Patients',
           data            : timeline.map(p => p.count),
           borderColor     : prim,
           backgroundColor : prim,
           fill            : false,
           tension         : 0.4
         }]
       };
       this.lineOpts = {
         maintainAspectRatio: false,
         plugins: { legend: { labels: { color: txt } } },
         scales : {
           x: { ticks: { color: txt2 }, grid: { color: border, drawBorder: false }},
           y: { ticks: { color: txt2 }, grid: { color: border, drawBorder: false }}
         }
       };
   
       /* --------------------------------------------------
          BAR CHART  ‑ Top 10 problem list items
          -------------------------------------------------- */
       const probEntries = Object.entries(data.problemListCounts)
                                 .sort((a,b) => b[1]-a[1])
                                 .slice(0,10);
       const probLabels  = probEntries.map(e => e[0]);
       const probValues  = probEntries.map(e => e[1]);
   
       this.barData = {
         labels  : probLabels,
         datasets: [{
           label           : '#Patients',
           data            : probValues,
           backgroundColor : prim2
         }]
       };
       this.barOpts = this.lineOpts;   // reuse styling
   
       /* --------------------------------------------------
          PIE / DOUGHNUT  ‑ Allergy distribution
          -------------------------------------------------- */
       const allergyLabels = Object.keys(data.allergiesDistribution);
       const allergyVals   = Object.values(data.allergiesDistribution);
   
       this.pieData = {
         labels  : allergyLabels.length ? allergyLabels : ['No‑Data'],
         datasets: [{
           data           : allergyVals.length ? allergyVals : [1],
           backgroundColor: [
             '#60a5fa','#fbbf24','#34d399','#f87171',
             '#a78bfa','#f472b6','#fcd34d','#c084fc','#4ade80','#facc15'
           ]
         }]
       };
       this.pieOpts = {
         plugins: {
           legend: { labels: { color: txt, usePointStyle: true }, position:'right' },
           tooltip: {
             callbacks: {
               label: (ctx: TooltipItem<'pie'>) =>
                 `${ctx.label}: ${ctx.parsed}`
             }
           }
         }
       };

           /* --------------------------------------------------
       POLAR AREA  ‑ risk‑category share (demo)
       -------------------------------------------------- */
    const riskTotals: Record<string, number> = { 'Low':0, 'Moderate':0, 'High':0 };
    (data.patientCountTimeline ?? []).forEach(_ => { /* real calc could go here */});
    //  demo values if nothing present
    if (!riskTotals['Low'] && !riskTotals['Moderate'] && !riskTotals['High']) {
      riskTotals['Low'] = 60; riskTotals['Moderate'] = 30; riskTotals['High'] = 10;
    }

    this.polarData = {
      labels  : Object.keys(riskTotals),
      datasets: [{
        data: Object.values(riskTotals),
        backgroundColor: ['#4ade80','#fbbf24','#f87171']
      }]
    };
    this.polarOpts = {
      plugins:{ legend:{ labels:{ color: txt } } },
      scales :{ r:{ grid:{ color: border }, ticks:{ color: txt2 } } }
    };

   
       /* --------------------------------------------------
          RADAR CHART ‑ Problem list split by sex
          (first 6 problems for readability)
          -------------------------------------------------- */
       const sexes        = Object.keys(data.problemListBySex);
       const radarLabels  = Object.keys(data.problemListCounts).slice(0,6);
   
       const radarDatasets = sexes.map((sex,idx) => {
         const vals = radarLabels.map(p =>
           data.problemListBySex[sex]?.[p] ?? 0);
   
         const base = ['#60a5fa','#fbbf24','#34d399','#f87171','#a78bfa'][idx] || prim;
         return {
           label           : sex,
           data            : vals,
           borderColor     : base,
           backgroundColor : base + '55'
         };
       });
   
       this.radarData = { labels: radarLabels, datasets: radarDatasets };
       this.radarOpts = {
         plugins:{ legend:{ labels:{ color: txt } } },
         scales :{ r:{ grid:{ color: border }, pointLabels:{ color: txt } } }
       };
     }
   }
   