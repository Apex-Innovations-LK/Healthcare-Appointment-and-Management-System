import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { DoctorSessions } from '../models/DoctorSessions';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { MakeAppointment } from '../models/makeAppointment';
import { BookingResponse } from '../models/BookingResponse';
import { Appointment } from '../models/Appointment';
import { UserDetails } from '../models/userDetails';
import { AuthService } from './auth.service';
import { Doctor } from '../models/doctor';

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

    constructor(
        private httpClient: HttpClient,
        private authService: AuthService
    ) {}

    getAppointments(): Observable<DoctorSessions[]> {
        return this.httpClient.get<any[]>(`${this.backendUrl}/get-slots`).pipe(
            map((data: any[]) => {                
                return data.map((item) => {
                    return new DoctorSessions(
                    item[0],
                    item[1],
                    new Date(item[2]),
                    new Date(item[3]));
                }
            );
            })
        );
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
        return this.authService.getDoctorById(doctorId).pipe(
            map((doctor: Doctor) => {
                // Create a UserDetails object with the doctor information
                return new UserDetails(
                    doctor.doctor_id,  // id
                    '',               // username (not needed for display)
                    doctor.first_name,
                    doctor.last_name,
                    new Date(),       // date_of_birth (not needed for display)
                    '',              // gender (not needed for display)
                    'DOCTOR',        // role
                    '',              // email (not needed for display)
                    '',              // phone_number (not needed for display)
                    'ACTIVE',        // status
                    '',              // password (not needed for display)
                    doctor.speciality,
                    doctor.license_number
                );
            })
        );
    }

    getUserDetails(username: string): Observable<UserDetails> {
        return this.httpClient.get<UserDetails>(`${this.backendUrl}/get-user-details/${username}`);
    }

    // Get patient ID by username
    getPatientIdByUsername(username: string): Observable<UserDetails> {
        return this.httpClient.get<UserDetails>(`${this.backendUrl}/get-patient-by-username/${username}`);
    }

    // Get session details by session ID
    getSessionDetails(sessionId: string): Observable<DoctorSessions> {
        console.log('[getSessionDetails] Requesting session details for sessionId:', sessionId);
        return this.httpClient.get<any>(`${this.backendUrl}/get-session/${sessionId}`).pipe(
            map((session: any) => {
                console.log('[getSessionDetails] Raw backend response:', session);
                if (!session) {
                    console.error('[getSessionDetails] Session not found for ID:', sessionId);
                    throw new Error('Session not found');
                }
                const doctorSession = new DoctorSessions(
                    session.session_id,
                    session.doctor_id,
                    new Date(session.from),
                    new Date(session.to)
                );
                console.log('[getSessionDetails] Parsed DoctorSessions object:', doctorSession);
                return doctorSession;
            }),
            // Catch HTTP errors (like 404, 500) and log them
            // (You can also import catchError from 'rxjs/operators' if not already)
            // catchError((error) => {
            //     console.error('[getSessionDetails] HTTP error:', error);
            //     throw error;
            // })
        );
    }

    // getAppointments(): Observable<DoctorSessions[]> {
    //     return this.httpClient.get<any[]>(`${this.backendUrl}/get-slots`).pipe(
    //         map((data: any[][]) => {
    //             return data.map((item) => new DoctorSessions(item[0], item[1], new Date(item[2]), new Date(item[3])));
    //         })
    //     );
    // }

    // Delete an appointment by its ID
    deleteAppointment(slot_id: string): Observable<any> {
        if (!slot_id) {
            return throwError(() => new Error('Invalid slot_id provided'));
        }
        console.log('Service: Deleting appointment with slot_id:', slot_id);
        return this.httpClient.delete(`${this.backendUrl}/delete-appointment/${slot_id}`).pipe(
            catchError(error => {
                console.error('Error in deleteAppointment service:', error);
                return throwError(() => error);
            })
        );
    }
}
