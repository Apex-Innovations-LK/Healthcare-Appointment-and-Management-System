import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WebRTCCallSession {
  id?: number;
  appointmentId?: number;
  firebaseCallId: string;
  startedBy: string;
  startedAt?: string;
  endedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebRTCService {
  private apiUrl = 'http://localhost:8080/api/webrtc/calls'; // Update with your actual API URL

  constructor(private http: HttpClient) {}

  startCall(session: WebRTCCallSession): Observable<WebRTCCallSession> {
    return this.http.post<WebRTCCallSession>(`${this.apiUrl}/start`, session);
  }

  endCall(id: number): Observable<WebRTCCallSession> {
    return this.http.post<WebRTCCallSession>(`${this.apiUrl}/end/${id}`, {});
  }

  getAllCalls(): Observable<WebRTCCallSession[]> {
    return this.http.get<WebRTCCallSession[]>(this.apiUrl);
  }
}