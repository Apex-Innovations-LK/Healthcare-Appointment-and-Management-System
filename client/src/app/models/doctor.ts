import { User } from './user';

export class Doctor {
  id: string;
  speciality: string;
  user: User;

  constructor(id: string, speciality: string, user: User) {
    this.id = id;
    this.speciality = speciality;
    this.user = user;
  }
}
