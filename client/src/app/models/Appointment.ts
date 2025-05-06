export class Appointment {
    appointment_id: number;
    patient_id: string;
    slotId: string;
    status: string;
    appointment_type: string;
    notes: string;

    constructor(appointment_id: number, patient_id: string, slotId: string, status: string, appointment_type: string, notes: string) {
        this.appointment_id = appointment_id;
        this.patient_id = patient_id;
        this.slotId = slotId;
        this.status = status;
        this.appointment_type = appointment_type;
        this.notes = notes;
    }
}