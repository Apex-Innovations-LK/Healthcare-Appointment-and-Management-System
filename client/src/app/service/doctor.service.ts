import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DoctorAvailability, DoctorSession, ExtraSlotInfo, HealthRecord, PatientGeneralInfo, SessionSlot } from '../models/doctor';
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

  getSlotsForSession(session_id:string) {
    const apiUrl = this.baseURL + '/getScheduleSlotsBySessionId';
    return this.httpClient.post<SessionSlot[]>(apiUrl, { sessionId: session_id });
  }

  uploadHr(hr: HealthRecord){
    const apiUrl = "http://127.0.0.1:8086/upload";
    return this.httpClient.post(apiUrl, hr, { responseType: 'text' });
  }

  getHrsByPatientId(patient_id: string): Observable<HealthRecord[]> {
    const apiUrl = this.baseURL + '/getHealthRecordsByPatientId';
    return this.httpClient.post<HealthRecord[]>(apiUrl, { patientId: patient_id });
  }

  getSlotDataBySlotId(slot_id: string){
    const apiUrl = "http://localhost:8080/api/appointment/get-patient";
    return this.httpClient.post<ExtraSlotInfo>(apiUrl, slot_id);
  }

  getPatientGeneralInfo(patient_id: string) {
    const apiUrl = "http://localhost:8080/api/auth/fetch-userinfo";
    return this.httpClient.post<PatientGeneralInfo>(apiUrl, patient_id);
  }
}
