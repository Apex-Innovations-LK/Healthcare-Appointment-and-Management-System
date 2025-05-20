export class Doctor {
    doctor_id: string;
    first_name: string;
    last_name: string;
    speciality: string;
    license_number: string;

    constructor(doctor_id: string, first_name: string, last_name: string, speciality: string, license_number: string) {
        this.doctor_id = doctor_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.speciality = speciality;
        this.license_number = license_number;
    }
}

export interface DoctorSession {
    session_id: string;
    doctor_id: string;
    from: string;
    to: string;
    number_of_patients: number;
}

export interface DoctorAvailability {
    session_id: string;
    doctor_id: string;
    from: string;
    to: string;
    number_of_patients: number;
}

export interface DoctorViewModalHandlers {
    editModalHandler: (availability: DoctorAvailability) => void;
    deleteModalHandler: (availability: DoctorAvailability) => void;
    //rejectModalHandler: () => void;
}

export interface SessionSlot {
    slot_id: string;
    session_id: string;
    status: 'booked' | 'available' | 'rejected';
}

export interface Slot {
    slotId: string;
    session_id: string;
    status: 'booked' | 'available' | 'rejected';
}

export interface PatientGeneralInfo {
        id: string;
        first_name: string;
        last_name: string;
        date_of_birth: string;
        gender: string;
        phone_number: string;
}

export interface HealthRecord {
    record_id: string;
    patient_id: string;
    patient_name: string;
    patient_dob: string;
    date_of_service: string;
    referring_doctor: string;
    chief_complaint: string[];
    allergies: string[];
    medications: string[];
    problem_list: string[];
    patient_sex: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    patient_phone: string;
    lbf_data: string[];
    his_data: string[];
}

export interface ExtraSlotInfo {
    patient_id: string;
    appoinment_type: 'IN_PERSON' | 'VIRTUAL';
}