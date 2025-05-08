import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DoctorAvailability, DoctorSession } from '../models/doctor';
import { Observable } from 'rxjs';

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
    const apiUrl = this.baseURL + '/getSessionsByDateAndDocId';

    return this.httpClient.post<DoctorAvailability[]>(apiUrl, body);
  }

  deleteAvailability(availability:DoctorAvailability){
    const apiUrl = this.baseURL + '/deleteSession';
    return this.httpClient.request('delete', apiUrl, {
      body: availability,
      responseType: 'text'
    });
  }

  updateAvailability(availability:DoctorAvailability){
    const apiUrl = this.baseURL + '/updateAvailability';
    return this.httpClient.put(apiUrl, availability);
  }

  addAvailability(availability:DoctorAvailability){
    const apiUrl = this.baseURL + '/addAvailability';
    return this.httpClient.post(apiUrl, availability);
  }
}
