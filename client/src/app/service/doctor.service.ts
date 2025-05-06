import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private baseURL = 'http://localhost:8080/api/doctors';
  constructor(private httpClient: HttpClient) { }

  getSessionsForDate(doctor_id:string, date: string) {
    const body = {
      doctor_id: doctor_id,
      date: date,
    };
    const apiUrl = this.baseURL + '/sessionsForDate';

    return this.httpClient.post<any[]>(apiUrl, body);
  }

  getAvailabilityForDate(doctor_id:string, date: string) {
    const body = {
      doctor_id: doctor_id,
      date: date,
    };
    const apiUrl = this.baseURL + '/availabilityForDate';

    return this.httpClient.post<any[]>(apiUrl, body);
  }

}
