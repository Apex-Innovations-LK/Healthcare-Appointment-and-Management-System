// notification.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Notification } from '../models/Notification';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private baseURL = 'http://35.184.60.72:8080/api/notify';
    constructor(private messageService: MessageService, private httpClient : HttpClient) {}

    showSuccess(message: string, title: string = 'Success') {
        this.messageService.add({
            severity: 'success',
            summary: title,
            detail: message
        });
    }

    showError(message: string, title: string = 'Error') {
        this.messageService.add({
            severity: 'error',
            summary: title,
            detail: message
        });
    }

    showInfo(message: string, title: string = 'Info') {
        this.messageService.add({
            severity: 'info',
            summary: title,
            detail: message
        });
    }

    showWarning(message: string, title: string = 'Warning') {
        this.messageService.add({
            severity: 'warn',
            summary: title,
            detail: message
        });
    }

    clear() {
        this.messageService.clear();
    }


    sendNotification(notification : Notification):Observable<any> {
        return this.httpClient.post(`${this.baseURL}/send`, notification);
    }
}
