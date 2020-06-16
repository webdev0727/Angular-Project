import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { AlertService } from 'ngx-alerts';
import { Alert, AlertType } from '../models/alert';

@Injectable()
export class AlertControllerService {
    private subject = new Subject<Alert>();
    private keepAfterRouteChange = false;

    constructor(private router: Router,
                private alertService: AlertService) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    this.keepAfterRouteChange = false;
                } else {
                    // clear alert messages
                    this.clear();
                }
            }
        });
    }

    getAlert(): Observable<any> {
        return this.subject.asObservable();
    }

    success(message: string, keepAfterRouteChange = false) {
        this.alertService.success(message);
    }

    error(message: string, keepAfterRouteChange = false) {
        this.alertService.danger(message);
    }

    info(message: string, keepAfterRouteChange = false) {
        this.alertService.info(message);
    }

    warn(message: string, keepAfterRouteChange = false) {
        this.alertService.warning(message);
    }

    alert(type: AlertType, message: string, keepAfterRouteChange = false) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next(<Alert>{ type: type, message: message });
    }

    serverError(errorType: number, data: string, message?: string, keepAfterRouteChange = false) {
        if (errorType === 1) {
            message = 'We are having trouble finding this ' + data;
        } else if (errorType === 2) {
            message = 'Our system had trouble with this ' + data;
        } else if (errorType === 3) {
            message = 'This user already exists in our system. Please try another.';
        } else if (errorType === 4) {
            message = 'The password is incorrect. Please try another.';
        } else {
            message = 'There was an issue loading. Please refresh the page!';
        }
        this.alertService.danger(message);
    }

    clear() {
        // clear alerts
        this.subject.next();
    }
}
