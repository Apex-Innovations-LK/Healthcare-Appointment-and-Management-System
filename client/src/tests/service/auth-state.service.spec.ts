import { TestBed } from '@angular/core/testing';
import { AuthStateService } from '../../app/service/auth-state.service';
import { TokenDecoderService, JwtPayload } from '../../app/service/token-decoder.service';

describe('AuthStateService', () => {
  let service: AuthStateService;
  let tokenDecoderSpy: jasmine.SpyObj<TokenDecoderService>;
  const dummyPayload: JwtPayload = { sub: 'testUser', role: 'ADMIN' };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TokenDecoderService', ['getDecodedToken']);
    TestBed.configureTestingModule({
      providers: [
        AuthStateService,
        { provide: TokenDecoderService, useValue: spy }
      ]
    });
    tokenDecoderSpy = TestBed.inject(TokenDecoderService) as jasmine.SpyObj<TokenDecoderService>;
    tokenDecoderSpy.getDecodedToken.and.returnValue(dummyPayload);
    service = TestBed.inject(AuthStateService);
  });

  it('should load user from token on init', () => {
    expect(service.getUser()).toEqual(dummyPayload);
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('getUsername returns the sub claim', () => {
    expect(service.getUsername()).toBe('testUser');
  });

  it('getRole returns the role claim', () => {
    expect(service.getRole()).toBe('ADMIN');
  });

  it('isAuthenticated is false after clear()', () => {
    spyOn(localStorage, 'removeItem');
    service.clear();
    expect(service.isAuthenticated()).toBeFalse();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('getUser returns null after clear()', () => {
    service.clear();
    expect(service.getUser()).toBeNull();
  });
});
