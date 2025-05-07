export interface ReportRequest {
    reportType: string;
    startDate?: string;
    endDate?: string;
    patientType?: string;
    patientSex?: string;
    ageRange?: string;
    city?: string;
    state?: string;
    allergies?: string[];
    medications?: string[];
}

export interface ReportData {
    title: string;
    data: Record<string, any>[];
    summary: Record<string, any>;
}

export interface VisualizationData {
    visits_by_month_labels: string[];
    visits_by_month_values: number[];
    diagnosis_labels: string[];
    diagnosis_values: number[];
    sex_labels: string[];
    sex_values: number[];
    age_labels: string[];
    age_values: number[];
    city_labels: string[];
    city_values: number[];
    summary: Record<string, any>;
}

export interface ExportRecord {
    request: any;
    reportType: string;
    filename: string;
    timestamp: string;
}
