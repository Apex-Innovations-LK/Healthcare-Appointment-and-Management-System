import { Injectable } from "@angular/core"
import { type Observable, of } from "rxjs"
import type { UtilizationRecord } from "../models/utilization.model"
import { StaffUtilizationOverall } from "../models/staffUtilizationOverall.model"
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: "root",
})
export class UtilizationService {

  private apiServerUrl = "http://localhost:8080/staff-utilization" // Replace with your API server URL

  // Sample utilization data with doctors and staff
  // private utilizationData: UtilizationRecord[] = [
  //   // RecordID : PK eka enna oneee
  //   {
  //     id: "DOC01",
  //     name: "Dr. Sarah Johnson",
  //     role: "Doctor",
  //     date: "2025-05-04",
  //     scheduled_hours: 8,
  //     active_hours: 5.5,
  //     utilization: 68.75,
  //     idle_time: "2.5",
  //     overtime: 0,
  //     status: "Normal",
  //   },
  //   {
  //     id: "STF01",
  //     name: "Michael Chen",
  //     role: "Staff",
  //     date: "2025-05-04",
  //     scheduled_hours: 8,
  //     active_hours: 7.2,
  //     utilization: 90.00,
  //     idle_time: "0.8",
  //     overtime: 0,
  //     status: "High",
  //   },
  //   {
  //     id: "DOC02",
  //     name: "Dr. James Wilson",
  //     role: "Doctor",
  //     date: "2025-05-04",
  //     scheduled_hours: 8,
  //     active_hours: 3.5,
  //     utilization: 43.75,
  //     idle_time: "4.5",
  //     overtime: 0,
  //     status: "Low",
  //   },
  //   {
  //     id: "STF02",
  //     name: "Emily Rodriguez",
  //     role: "Staff",
  //     date: "2025-05-03",
  //     scheduled_hours: 8,
  //     active_hours: 6.5,
  //     utilization: 81.25,
  //     idle_time: "1.5",
  //     overtime: 0,
  //     status: "Normal",
  //   },
  //   {
  //     id: "DOC03",
  //     name: "Dr. Aisha Patel",
  //     role: "Doctor",
  //     date: "2025-05-04",
  //     scheduled_hours: 8,
  //     active_hours: 8.5,
  //     utilization: 106.25,
  //     idle_time: "0",
  //     overtime: 0.5,
  //     status: "High",
  //   },
  //   {
  //     id: "STF03",
  //     name: "Robert Kim",
  //     role: "Staff",
  //     date: "2025-05-04",
  //     scheduled_hours: 4,
  //     active_hours: 3.8,
  //     utilization: 95.00,
  //     idle_time: "0.2",
  //     overtime: 0,
  //     status: "High",
  //   },
  //   {
  //     id: "DOC04",
  //     name: "Dr. Thomas Garcia",
  //     role: "Doctor",
  //     date: "2025-05-03",
  //     scheduled_hours: 8,
  //     active_hours: 6.8,
  //     utilization: 85.00,
  //     idle_time: "1.2",
  //     overtime: 0,
  //     status: "Normal",
  //   },
  //   {
  //     id: "STF04",
  //     name: "Jennifer Smith",
  //     role: "Staff",
  //     date: "2025-05-03",
  //     scheduled_hours: 8,
  //     active_hours: 4.2,
  //     utilization: 52.50,
  //     idle_time: "3.8",
  //     overtime: 0,
  //     status: "Low",
  //   },
  // ]

  constructor(private http : HttpClient) {}

  getUtilizationData(): Observable<UtilizationRecord[]> {
    // In a real app, this would be an HTTP call to your backend API
    return this.http.get<UtilizationRecord[]>(`${this.apiServerUrl}/all`);
  }

  getUtilizationDataById(id: string): Observable<UtilizationRecord | undefined> {
    // In a real app, this would be an HTTP call to your backend API
    return this.http.get<UtilizationRecord>(`${this.apiServerUrl}/find/${id}`)
  }

  getStaffUtilizationOverall(): Observable<StaffUtilizationOverall> {
    return this.http.get<StaffUtilizationOverall>(`${this.apiServerUrl}/overall`)
  }

}
