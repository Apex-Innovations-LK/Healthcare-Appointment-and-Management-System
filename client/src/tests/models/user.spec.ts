import { User } from '../../app/models/user';

describe('User model', () => {
  it('constructor assigns all fields', () => {
    const dob = new Date('2000-01-01');
    const u = new User('u','f','l', dob, 'M','role','e','p','active','pwd','spec','lic');
    expect(u.username).toBe('u');
    expect(u.first_name).toBe('f');
    expect(u.license_number).toBe('lic');
  });
});
