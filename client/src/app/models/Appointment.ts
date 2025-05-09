export class Appointment {
    appointment_id: number;
    patient_id: string;
    session_id: string;
    slot_id: string;  // This will store the UUID as a string
    slotId?: string;  // Alternative property name
    status: string;
    appointment_type: string;
    notes: string;

    constructor(appointment_id: number, patient_id: string, session_id: string, slot_id: string, status: string, appointment_type: string, notes: string) {
        this.appointment_id = appointment_id;
        this.patient_id = patient_id;
        this.session_id = session_id;
        this.slot_id = slot_id;
        this.slotId = slot_id;  // Set both properties
        this.status = status;
        this.appointment_type = appointment_type;
        this.notes = notes;
    }
}