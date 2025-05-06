import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
}

@Injectable({ providedIn: 'root' })
export class PatientService {
    private baseUrl = '/api';

    constructor(private http: HttpClient) {}

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
        return this.http.get<RiskAssessment>(`${this.baseUrl}/risk-assessment/advanced/${patientId}`);
    }

    getAllRiskAssessments(): Observable<RiskAssessment[]> {
        return this.http.get<RiskAssessment[]>(`${this.baseUrl}/risk-assessment`);
    }
}
