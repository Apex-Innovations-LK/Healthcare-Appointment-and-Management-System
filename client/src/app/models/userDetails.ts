export class UserDetails {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    gender: string;
    role: string;
    email: string;
    phone_number: string;
    status: string;
    password: string;
    // Optional fields for doctor
    speciality?: string;
    license_number?: string;

    constructor(id:string, username: string, first_name: string, last_name: string, date_of_birth: Date, gender: string, role: string, email: string, phone_number: string, status: string, password: string, speciality?: string, license_number?: string) {
        this.id = id;
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
        this.date_of_birth = date_of_birth;
        this.gender = gender;
        this.role = role;
        this.email = email;
        this.phone_number = phone_number;
        this.status = status;
        this.password = password;
        this.speciality = speciality;
        this.license_number = license_number;
    }
}
