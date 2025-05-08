export class Schedule {
    doctor_id: string;
    from: Date | string;
    to: Date | string;

    constructor(doctor_id: string, from: Date, to: Date) {
        this.doctor_id = doctor_id;
        this.from = from;
        this.to = to;
    }
}   