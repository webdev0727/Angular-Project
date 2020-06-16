import { Injectable, NgZone } from "@angular/core";
import { environment } from "../../environments/environment";
import { AlertControllerService } from "./alert.service";
import { MatSnackBar } from '@angular/material';

@Injectable()
export class LogService {
isProduction = (environment.production === true);

  constructor(
    public snackBar: MatSnackBar,
    private zone: NgZone,
    private alertService: AlertControllerService
    ) {}

  console(error: any, alert?: boolean) {
    if (error.status !== 403) {
      if (this.isProduction === true) {
        console.log('Error: ', error.message);
        if (alert === true) {
            this.alertService.serverError(error.error.errorType, error.error.data);
        }
      } else {
        console.log('Error: %o', error);
        if (alert === true) {
            this.alertService.serverError(error.error.errorType, error.error.data);
        }
      }
    }
  }

  error(message: string) {
    this.alertService.error(message);
  }

  success(message: string) {
    this.alertService.success(message);
  }

  warn(message: string, showConsole?: boolean, error?: any) {
    if (this.isProduction === true) {
      if (showConsole) {
        console.log('Error: ', error.message);
      }
      this.alertService.warn(message);
    } else {
      if (showConsole) {
        console.log('Error: %o', error);
      }
      this.alertService.warn(message);
    }
  }

  public snack(message, action, duration, type?: string, position?: string) {
    position = position ? position : 'top';
    type = type ? type : 'snackbar-warning';
    duration = duration ? duration : 2000;
    this.zone.run(() => {
        this.snackBar.open(message, action, { 
          duration: duration,
          // verticalPosition: 'top',
          // panelClass: [type]
         });
    });
  }

}
