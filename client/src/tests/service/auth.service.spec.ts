import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '../../app/service/auth.service';
import { User } from '../../app/models/user';
import { AuthResponse } from '../../app/models/auth-response';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const baseURL = 'http://localhost:8080/api/auth';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('registerUser should POST to /register and return AuthResponse', (done) => {
    const dummyUser = new User('u','f','l', new Date(), 'M','USER','e','p','active','pwd');
    const dummyResp: AuthResponse = {
      token: 'abc123',
      username: 'u',
      role: 'USER',
      status: 'SUCCESS',
      message: 'Registered'
    };

    service.registerUser(dummyUser).subscribe(resp => {
      expect(resp).toEqual(dummyResp);
      done();
    });

    const req = httpMock.expectOne(`${baseURL}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyUser);
    req.flush(dummyResp);
  });

  it('loginUser should POST to /login and return AuthResponse', (done) => {
    const dummyUser = new User('u','f','l', new Date(), 'M','USER','e','p','active','pwd');
    const dummyResp: AuthResponse = {
      token: 'def456',
      username: 'u',
      role: 'USER',
      status: 'SUCCESS',
      message: 'Logged in'
    };

    service.loginUser(dummyUser).subscribe(resp => {
      expect(resp).toEqual(dummyResp);
      done();
    });

    const req = httpMock.expectOne(`${baseURL}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyUser);
    req.flush(dummyResp);
  });
});
