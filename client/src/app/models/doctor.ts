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