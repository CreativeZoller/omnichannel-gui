import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, MatSnackBarConfig } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public snackBarConfig: MatSnackBarConfig;
  public snackBarRef: MatSnackBarRef<any>;
  public snackBarAutoHide = '5000';

  constructor(public sb: MatSnackBar) {}

  openSnackBar(message: string) {
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.duration = parseInt(this.snackBarAutoHide, 0);
    this.sb.open(message, 'Dismiss', this.snackBarConfig);
  }

  openSnackBarError(error: Response | HttpErrorResponse | Error) {
    let errMsg: string;
    if (error instanceof Response || error instanceof HttpErrorResponse) {
      errMsg = `${error.status} - ${error.statusText || ''} ${error.type}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.duration = parseInt(this.snackBarAutoHide, 0);
    if (error instanceof Response || error instanceof HttpErrorResponse) {
      let httpErrorCode = '' + error.status;
      if (httpErrorCode == null || httpErrorCode === undefined || httpErrorCode === '') httpErrorCode = '500';
      switch (httpErrorCode) {
        case '401':
          this.sb.open('401 UNAUTHORIZED', 'Dismiss', this.snackBarConfig);
          break;
        case '403':
          this.sb.open('403 USER HAS NO PERMISSION', 'Dismiss', this.snackBarConfig);
          break;
        default:
          this.sb.open('Please refresh the page ! An error occurred:' + errMsg, 'Dismiss', this.snackBarConfig);
          break;
      }
    } else {
      this.sb.open('An error occurred:' + errMsg, 'Dismiss', this.snackBarConfig);
    }
  }
}
