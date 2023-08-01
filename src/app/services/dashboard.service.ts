import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../constants';
import { IAccountCountInterval } from '../models/accountCountInterval';
import { ICommandStatisticResponse } from '../models/commandStatisticResponse';
import { IFailedMessage } from '../models/failedMessages';
import { IMessageCount } from '../models/messageCount';
import { IMessageRateResponse } from '../models/messageRateResponse';
import { Messages } from '../models/messages';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiURL = Constants.apiRoot;

  constructor(private httpClient: HttpClient) {}

  public getAccountCountForLastInterval(companyId: string) {
    return this.httpClient.get<IAccountCountInterval>(`${this.apiURL}Dashboard/${companyId}/GetAccountCountForLastInterval`);
  }

  public getCommandStatistic(companyId: string) {
    return this.httpClient.get<ICommandStatisticResponse[]>(`${this.apiURL}Dashboard/${companyId}/GetCommandStatistic`);
  }

  public getH2HRequests(companyId: string) {
    return this.httpClient.get<Messages[]>(`${this.apiURL}Dashboard/${companyId}/GetH2HRequests`);
  }

  public getFailedMessages(companyId: string) {
    return this.httpClient.get<IFailedMessage[]>(`${this.apiURL}Dashboard/${companyId}/GetFailedMessages`);
  }

  public getLastMessages(companyId: string) {
    return this.httpClient.get<Messages[]>(`${this.apiURL}Dashboard/${companyId}/GetLastMessages`);
  }

  public getMessageRate(companyId: string) {
    return this.httpClient.get<IMessageRateResponse>(`${this.apiURL}Dashboard/${companyId}/GetMessageRate`);
  }

  public getMessageCountLastMonth(companyId: string) {
    return this.httpClient.get<IMessageCount[]>(`${this.apiURL}Dashboard/${companyId}/GetMessageCountLastMonth`);
  }
}
