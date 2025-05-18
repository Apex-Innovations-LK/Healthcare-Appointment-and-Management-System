import { Injectable } from "@angular/core"
import { type Observable, of } from "rxjs"
import type { UtilizationRecord } from "../models/utilization.model"
import { StaffUtilizationOverall } from "../models/staffUtilizationOverall.model"
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: "root",
})
export class UtilizationService {

  private apiUrl = "http://localhost:8087/api/staff/staff-utilization" // Replace with your API server URL

  
  constructor(private http : HttpClient) {}

  getUtilizationData(): Observable<UtilizationRecord[]> {
    // In a real app, this would be an HTTP call to your backend API
    return this.http.get<UtilizationRecord[]>(`${this.apiUrl}/all`);
  }

  getUtilizationDataById(id: string): Observable<UtilizationRecord | undefined> {
    // In a real app, this would be an HTTP call to your backend API
    return this.http.get<UtilizationRecord>(`${this.apiUrl}/find/${id}`)
  }

  getStaffUtilizationOverall(): Observable<StaffUtilizationOverall> {
    return this.http.get<StaffUtilizationOverall>(`${this.apiUrl}/overall`)
  }

}
