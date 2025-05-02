import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  // Change this URL to match your backend endpoint
  private apiUrl = 'http://localhost:8080/api/analytics';  // Backend API URL

  constructor(private http: HttpClient) { }

  // Method to fetch analytics data from backend
  getAnalyticsData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
