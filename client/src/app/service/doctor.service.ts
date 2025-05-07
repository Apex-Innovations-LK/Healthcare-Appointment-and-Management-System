import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DoctorAvailability, DoctorSession } from '../models/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private baseURL = 'http://localhost:8080/api/doctors';
  constructor(private httpClient: HttpClient) { }

  getSessionsForDate(doctor_id:string, date: string) {
    const body = {
      doctorId: doctor_id,
      date: date,
    };
    const apiUrl = this.baseURL + '/getSessionsByDateAndDocId';

    return this.httpClient.post<DoctorSession[]>(apiUrl, body);
  }

  getAvailabilityForDate(doctor_id:string, date: string) {
    const body = {
      doctorId: doctor_id,
      date: date,
    };
    const apiUrl = this.baseURL + '/availabilityForDate';

    return this.httpClient.post<DoctorAvailability[]>(apiUrl, body);
  }

}
