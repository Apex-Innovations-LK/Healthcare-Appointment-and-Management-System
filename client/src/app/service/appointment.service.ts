import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DoctorSessions } from '../models/DoctorSessions';
import { map } from 'rxjs/operators';
import { MakeAppointment } from '../models/makeAppointment';
import { BookingResponse } from '../models/BookingResponse';
import { Appointment } from '../models/Appointment';
import { UserDetails } from '../models/userDetails';

interface Appointments {
    patient_id: string;
    appointment_type: string;
    slot_id: string;
}

@Injectable({
    providedIn: 'root'
})
export class AppointmentsService {
    private backendUrl = 'http://localhost:8080/api/appointment';

    constructor(private httpClient: HttpClient) {}

    getAppointments(): Observable<DoctorSessions[]> {
        return this.httpClient.get<DoctorSessions[]>(`${this.backendUrl}/get-slots`);
    }

    bookAppointment(appointment: MakeAppointment): Observable<string> {
        return this.httpClient.post<string>(`${this.backendUrl}/book-appointment`, appointment);
    }

    // Fetch appointments for the logged-in patient
    viewAppointments(patientId: string): Observable<Appointment[]> {
        return this.httpClient.get<Appointment[]>(`${this.backendUrl}/view-appointments/${patientId}`);
    }

    // Fetch doctor details using doctor_id
    getDoctorDetails(doctorId: string): Observable<UserDetails> {
        return this.httpClient.get<UserDetails>(`${this.backendUrl}/get-doctor-details/${doctorId}`);
    }

    // getAppointments(): Observable<DoctorSessions[]> {
    //     return this.httpClient.get<any[]>(`${this.backendUrl}/get-slots`).pipe(
    //         map((data: any[][]) => {
    //             return data.map((item) => new DoctorSessions(item[0], item[1], new Date(item[2]), new Date(item[3])));
    //         })
    //     );
    // }
}
