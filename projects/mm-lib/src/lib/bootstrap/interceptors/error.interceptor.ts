import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {TuiAlertService, TuiNotification} from '@taiga-ui/core';
import {catchError, Observable, of, take, tap} from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor (@Inject(TuiAlertService) private readonly alerts: TuiAlertService) {
    }

    intercept (request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((error: any) => {
                this._handleError(error);
                return of(error);
            }),
        );
    }

    private _handleError (error: any): void {
        if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
                this._handleAuthError(error);
            } else if ((error.status > 500 && error.status < 600) || error.status === 0) {
                this._handleServerError(error);
            }
        }
    }

    private _handleAuthError (error: HttpErrorResponse): void {
        // handle auth errors
    }

    private _handleServerError (error: HttpErrorResponse): void {
        this.alerts
            .open('QR Code creation failed', {
                label: 'Server error',
                autoClose: 3000,
                hasCloseButton: true,
                hasIcon: false,
                status: TuiNotification.Error,
            }).pipe(take(1))
            .subscribe();
    }
}
