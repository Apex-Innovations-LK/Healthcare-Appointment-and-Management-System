import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ReportRequest, ReportData, VisualizationData, ExportRecord } from '../models/report.model';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private apiUrl = 'http://localhost:8080/api/reports';
    private exportHistory: ExportRecord[] = this.loadExportHistory();

    constructor(private http: HttpClient) {}

    generateReport(request: ReportRequest): Observable<ReportData> {
        return this.http.post<ReportData>(`${this.apiUrl}/generate`, request).pipe(catchError(this.handleError));
    }

    exportCsv(request: ReportRequest): Observable<Blob> {
        console.log('Export CSV request:', request); // Debug payload
        return this.http
            .post(`${this.apiUrl}/export/csv`, request, {
                responseType: 'blob'
            })
            .pipe(
                tap((blob) => {
                    const filename = `${request.reportType}_${request.startDate || 'all'}_${request.endDate || 'all'}.csv`;
                    this.addExportRecord(request, filename);
                }),
                catchError(this.handleError)
            );
    }

    getVisualizationData(request: ReportRequest): Observable<VisualizationData> {
        return this.http.post<VisualizationData>(`${this.apiUrl}/visualization-data`, request).pipe(catchError(this.handleError));
    }

    getExportHistory(): ExportRecord[] {
        return this.exportHistory;
    }

    private addExportRecord(request: ReportRequest, filename: string): void {
        const record: ExportRecord = {
            reportType: request.reportType,
            filename,
            timestamp: new Date().toISOString(),
            request
        };
        this.exportHistory.unshift(record);
        localStorage.setItem('exportHistory', JSON.stringify(this.exportHistory));
    }

    private loadExportHistory(): ExportRecord[] {
        try {
            const history = localStorage.getItem('exportHistory');
            if (!history) return [];
            const parsed = JSON.parse(history);
            return parsed.map((record: any) => ({
                ...record,
                request: record.request || {} // Fallback for older records
            }));
        } catch (error) {
            console.error('Error parsing export history:', error);
            return [];
        }
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An error occurred';
        if (error.status === 400) {
            errorMessage = 'Invalid input. Please check your request data (e.g., date format YYYY-MM-DD).';
        } else if (error.status === 500) {
            errorMessage = 'Server error. Please try again later.';
        }
        return throwError(() => new Error(errorMessage));
    }
}
