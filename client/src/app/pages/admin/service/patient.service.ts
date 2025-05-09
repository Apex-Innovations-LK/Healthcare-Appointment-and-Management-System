import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

export interface PatientRecord {
    patientId: string;
    patientName: string;
    patientDob: string;
    referringDoctor: string;
    chiefComplaint: string[];
    allergies: string[];
    medications: string[];
    problemList: string[];
    patientSex: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    patientPhone: string;
    lbfData: string[];
    hisData: string[];
}

export interface RiskAssessment {
    patientId: string;
    riskLevel: string;
    riskReason: string;
    riskProbability: number;
}

export interface RiskDistribution {
    [key: string]: number;
}

@Injectable({ providedIn: 'root' })
export class PatientService {
    private baseUrl = 'http://localhost:8080/api';
    private distributionCache: RiskDistribution | null = null;
    private distributionCacheTime: number = 0;
    private readonly CACHE_KEY = 'risk_distribution_cache';
    private readonly CACHE_TIME_KEY = 'risk_distribution_cache_time';
    private readonly CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes in milliseconds

    constructor(private http: HttpClient) {
        // Load cache from localStorage when service initializes
        this.loadCacheFromStorage();
    }

    private loadCacheFromStorage(): void {
        const cachedData = localStorage.getItem(this.CACHE_KEY);
        const cachedTime = localStorage.getItem(this.CACHE_TIME_KEY);
        
        if (cachedData && cachedTime) {
            const timestamp = parseInt(cachedTime, 10);
            const now = Date.now();
            
            // Check if cache is still valid (not expired)
            if (now - timestamp < this.CACHE_EXPIRY) {
                this.distributionCache = JSON.parse(cachedData);
                this.distributionCacheTime = timestamp;
                console.log('Loaded risk distribution cache from localStorage');
            } else {
                // Clear expired cache
                console.log('Cache expired, clearing localStorage');
                this.clearDistributionCache();
            }
        }
    }

    private saveCacheToStorage(data: RiskDistribution, timestamp: number): void {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(this.CACHE_TIME_KEY, timestamp.toString());
    }

    getAllPatients(): Observable<PatientRecord[]> {
        return this.http.get<any[]>(`${this.baseUrl}/risk-assessment/patients`).pipe(
            map(data => data.map(p => ({
                patientId: p.patient_id,
                patientName: p.patient_name,
                patientDob: p.patient_dob,
                referringDoctor: p.referring_doctor,
                chiefComplaint: p.chief_complaint,
                allergies: p.allergies,
                medications: p.medications,
                problemList: p.problem_list,
                patientSex: p.patient_sex,
                address: p.address,
                city: p.city,
                state: p.state,
                zip: p.zip,
                patientPhone: p.patient_phone,
                lbfData: p.lbf_data,
                hisData: p.his_data
            })))
        );
    }

    getRiskAssessment(patientId: string): Observable<RiskAssessment> {
        return this.http.get<RiskAssessment>(`${this.baseUrl}/risk-assessment/${patientId}`);
    }

    getAllRiskAssessments(): Observable<RiskAssessment[]> {
        return this.http.get<RiskAssessment[]>(`${this.baseUrl}/risk-assessment`);
    }
    
    getRiskDistribution(forceRefresh: boolean = false): Observable<RiskDistribution> {
        // Use cached data if available and not forced to refresh
        if (this.distributionCache && !forceRefresh) {
            console.log('Using cached risk distribution data');
            return of(this.distributionCache);
        }
        
        // Otherwise fetch fresh data
        console.log('Fetching fresh risk distribution data');
        return this.http.get<RiskDistribution>(`${this.baseUrl}/risk-assessment/distribution`).pipe(
            tap(data => {
                this.distributionCache = data;
                this.distributionCacheTime = Date.now();
                this.saveCacheToStorage(data, this.distributionCacheTime);
            }),
            catchError(error => {
                console.error('Error fetching risk distribution', error);
                return of({} as RiskDistribution);
            })
        );
    }
    
    refreshRiskDistribution(): Observable<RiskDistribution> {
        // Force a refresh of the risk distribution data
        this.clearDistributionCache();
        return this.getRiskDistribution(true);
    }
    
    clearDistributionCache() {
        this.distributionCache = null;
        this.distributionCacheTime = 0;
        localStorage.removeItem(this.CACHE_KEY);
        localStorage.removeItem(this.CACHE_TIME_KEY);
    }
    
    /**
     * Get the timestamp when the distribution data was last cached
     * @returns The timestamp in milliseconds since epoch
     */
    getDistributionCacheTime(): number {
        return this.distributionCacheTime;
    }
}
