export class DoctorSessions {
    slot_id: string;
    doctor_id: string;
    from: Date;
    to: Date;

    constructor(slot_id: string, doctor_id: string, from: Date, to: Date) {
        this.slot_id = slot_id;
        this.doctor_id = doctor_id;
        this.from = from;
        this.to= to;
    }
}