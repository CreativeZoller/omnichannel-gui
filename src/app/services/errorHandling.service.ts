import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}

  handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    let httpErrorCode = '' + error.status;
    if (httpErrorCode == null || httpErrorCode === undefined || httpErrorCode === '') httpErrorCode = '500';
    switch (httpErrorCode) {
      case '401':
        this.handleErrorData('401', 'UNAUTHORIZED');
        break;
      case '403':
        this.handleErrorData('403', 'USER HAS NO PERMISSION');
        break;
      case '400':
        this.handleErrorData('400', 'NOT FOUND');
        break;
      default:
        this.handleErrorData('500', 'Please refresh the page ! An error occurred:' + errMsg);
        break;
    }
  }

  private handleErrorData(errorCode: string, errorMessage: string) {
    let message = '';
    if (errorMessage.length > 100) {
      message = errorMessage.substring(0, 97) + ' ...';
    } else {
      message = errorMessage;
    }

    alert(message + 'Error code :' + errorCode);
    console.log(errorMessage + ', Error code :' + errorCode);
  }
}
