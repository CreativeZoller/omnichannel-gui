import { Injectable } from '@angular/core';
import { Constants } from '../constants';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { ErrorHandlerService } from '@services/errorHandling.service';

@Injectable()
export class OktaAPIService {
  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {}

  passwordReset(username: string): any {
    return this.http.post(`${Constants.oktaDomain}api/v1/authn/recovery/password`, {
      username,
      factorType: 'EMAIL',
      relayState: Constants.webRoot,
    });
  }
}
