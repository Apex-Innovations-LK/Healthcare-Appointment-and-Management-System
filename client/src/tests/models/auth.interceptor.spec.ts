// tests/models/auth.interceptor.spec.ts

import { authInterceptor } from '../../app/models/auth.interceptor';
import { HttpRequest, HttpResponse, HttpEvent } from '@angular/common/http';
import { of, Observable } from 'rxjs';

describe('authInterceptor', () => {
  it('adds Authorization header when token exists', (done) => {
    localStorage.setItem('token', '123');
    const req = new HttpRequest('GET', '/test');
    let handledReq: HttpRequest<any> | null = null;

    // next must be a function that returns Observable<HttpEvent>
    const next = (r: HttpRequest<any>): Observable<HttpEvent<any>> => {
      handledReq = r;
      // return an actual HttpResponse so the types line up
      return of(new HttpResponse({ status: 200 }));
    };

    authInterceptor(req, next).subscribe(() => {
      expect(handledReq!.headers.get('Authorization')).toBe('Bearer 123');
      done();
    });
  });

  it('passes through when no token', (done) => {
    localStorage.removeItem('token');
    const req = new HttpRequest('GET', '/test');
    let handledReq: HttpRequest<any> | null = null;

    const next = (r: HttpRequest<any>): Observable<HttpEvent<any>> => {
      handledReq = r;
      return of(new HttpResponse({ status: 200 }));
    };

    authInterceptor(req, next).subscribe(() => {
      expect(handledReq).toBe(req);
      done();
    });
  });
});
