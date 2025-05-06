export class MakeAppointment {
    slotId: string;
    patient_id: string;
    appointment_type: string;

    constructor(patient_id: string, appointment_type: string, slotId: string) {
        this.slotId = slotId;
        this.patient_id = patient_id;
        this.appointment_type = appointment_type;
    }
}