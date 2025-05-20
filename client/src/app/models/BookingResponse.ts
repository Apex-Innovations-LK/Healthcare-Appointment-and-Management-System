export class BookingResponse { 
    doctor_id: string;
    time: Date;

    constructor(doctor_id: string, time: Date) {
        this.doctor_id = doctor_id;
        this.time = time;
    }
}