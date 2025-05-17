import { TestBed } from '@angular/core/testing';
import { TokenDecoderService, JwtPayload } from '../../app/service/token-decoder.service';

describe('TokenDecoderService', () => {
  let service: TokenDecoderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenDecoderService]
    });
    service = TestBed.inject(TokenDecoderService);
    localStorage.clear();
  });

  it('getToken returns null when no token in storage', () => {
    expect(service.getToken()).toBeNull();
  });

  it('getToken returns the stored token', () => {
    localStorage.setItem('token', 'my.jwt.token');
    expect(service.getToken()).toBe('my.jwt.token');
  });

  it('decodeToken returns payload for a valid JWT', () => {
    const payload: JwtPayload = { sub: 'alice', role: 'USER' };
    // header {"alg":"none"} → base64, payload → base64, no signature
    const header = btoa(JSON.stringify({ alg: 'none' }));
    const body   = btoa(JSON.stringify(payload));
    const token  = `${header}.${body}.`;
    const decoded = service.decodeToken(token);
    expect(decoded).toEqual(jasmine.objectContaining({ sub: 'alice', role: 'USER' }));
  });

  it('decodeToken returns null and logs error for invalid JWT', () => {
    spyOn(console, 'error');
    const result = service.decodeToken('invalid.token.value');
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  it('getDecodedToken returns null if no token', () => {
    expect(service.getDecodedToken()).toBeNull();
  });

  it('getDecodedToken returns decoded payload when token present', () => {
    spyOn(service, 'decodeToken').and.returnValue({ sub: 'bob' });
    localStorage.setItem('token', 'anything');
    expect(service.getDecodedToken()).toEqual({ sub: 'bob' });
    expect(service.decodeToken).toHaveBeenCalledWith('anything');
  });
});
