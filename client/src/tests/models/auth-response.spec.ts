import { AuthResponse } from '../../app/models/auth-response';

describe('AuthResponse interface (compile-time)', () => {
  it('should allow assignment matching shape', () => {
    const resp: AuthResponse = {
      token: 'abc',
      username: 'u',
      role: 'r',
      status: 'ok',
      message: 'msg'
    };
    expect(resp.username).toBe('u');
  });
});
