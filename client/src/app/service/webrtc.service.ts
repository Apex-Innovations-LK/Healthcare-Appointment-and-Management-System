import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  private apiUrl = 'http://localhost:8080/api/webrtc/calls';

  constructor(private http: HttpClient) {}

  startCall(session: WebRTCCallSession): Observable<WebRTCCallSession> {
    return this.http.post<WebRTCCallSession>(`${this.apiUrl}/start`, session, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    });
  }

  endCall(id: number): Observable<WebRTCCallSession> {
    return this.http.post<WebRTCCallSession>(`${this.apiUrl}/end/${id}`, {}, {
      withCredentials: true
    });
  }

  getAllCalls(): Observable<WebRTCCallSession[]> {
    return this.http.get<WebRTCCallSession[]>(this.apiUrl, {
      withCredentials: true
    });
  }
}