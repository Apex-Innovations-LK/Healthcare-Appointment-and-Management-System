export class DoctorSessions {
    session_id: string;
    doctor_id: string;
    from: Date;
    to: Date;

    constructor(session_id: string, doctor_id: string, from: Date, to: Date) {
        this.session_id = session_id;
        this.doctor_id = doctor_id;
        this.from = from;
        this.to = to;
    }
}