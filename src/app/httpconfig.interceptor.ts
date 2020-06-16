import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable() export class HttpConfigInterceptor implements HttpInterceptor {

    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token: string = localStorage.getItem('token');
        const isInternalRequest = request.url.indexOf(environment.devApiUrl) !== -1 || request.url.indexOf(environment.apiUrl) !== -1 || request.url.indexOf(environment.stagingApiUrl) !== -1

        if (token && isInternalRequest) {
            request = request.clone({
                setHeaders: {
                    'x-access-token': token,
                }
            });
        }

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                return throwError(error);
            }));
    }

}
