import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const router = inject(Router);

    const token = localStorage.getItem('token');

    console.log('Auth Interceptor - Token:', token);

    if (token) {
        const authRequest = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        return next(authRequest).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log('Auth Interceptor - Error:', error);

                if (error.status === 401 || error.status === 403) {
                    // Token might be expired or invalid
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');

                    router.navigate(['/auth/login']);
                }

                return throwError(() => error);
            })
        );
    }

    console.log('Auth Interceptor - No token found, proceeding without auth header'); 
    return next(request);
};
