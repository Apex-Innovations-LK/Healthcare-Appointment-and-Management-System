/* ---------------------------------------------------------
   Strongly‑typed Angular service for analytics dashboard
   --------------------------------------------------------- */
   import { Injectable } from '@angular/core';
   import { HttpClient } from '@angular/common/http';
   import { Observable } from 'rxjs';
   
   /* ========= DTOs that reflect the Spring JSON ========== */
   export interface Point {
     date:  string;   // e.g. "2025‑01"
     count: number;
   }
   
   export interface AnalyticsData {
     patientCountTimeline : Point[];
     allergiesDistribution: Record<string, number>;
     problemListCounts    : Record<string, number>;
     problemListBySex     : Record<string, Record<string, number>>;
   }
   
   @Injectable({ providedIn: 'root' })
   export class AnalyticsService {
   
     private readonly apiUrl = 'http://localhost:8080/api/analytics';
   
     constructor(private http: HttpClient) {}
   
     /** Fetch aggregated analytics from backend */
     getAnalyticsData(): Observable<AnalyticsData> {
       return this.http.get<AnalyticsData>(this.apiUrl);
     }
   }
   