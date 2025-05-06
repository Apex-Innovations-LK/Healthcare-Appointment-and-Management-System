import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DoctorSessions } from '../models/DoctorSessions';
import { map } from 'rxjs/operators';
import { MakeAppointment } from '../models/makeAppointment';
import { BookingResponse } from '../models/BookingResponse';

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

    // getAppointments(): Observable<DoctorSessions[]> {
    //     return this.httpClient.get<any[]>(`${this.backendUrl}/get-slots`).pipe(
    //         map((data: any[][]) => {
    //             return data.map((item) => new DoctorSessions(item[0], item[1], new Date(item[2]), new Date(item[3])));
    //         })
    //     );
    // }
}
