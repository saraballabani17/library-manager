import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { HttpErrorResponse, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { routes } from './app.routes';

const AUTH_FREE_PATHS = ['/auth/login/', '/auth/register/'];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        (req, next) => {
          const isAuthFree = AUTH_FREE_PATHS.some((path) => req.url.includes(path));
          const token = localStorage.getItem('token');
          const authedReq =
            token && !isAuthFree ? req.clone({ setHeaders: { Authorization: `Token ${token}` } }) : req;

          return next(authedReq).pipe(
            catchError((err: unknown) => {
              if (!isAuthFree && err instanceof HttpErrorResponse && err.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }
              return throwError(() => err);
            }),
          );
        },
      ]),
    ),
  ],
};
