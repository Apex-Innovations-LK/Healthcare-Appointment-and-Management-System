import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
    id: number;
    appointmentId: string;
    patientId: string;
    slotId: string;
    status: string;
    appointmentType: string;
    notes: string;
  }

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private apiUrl = 'http://localhost:8081/api/appointments';

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  cancelAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`/api/appointments/${id}`);
  }
}