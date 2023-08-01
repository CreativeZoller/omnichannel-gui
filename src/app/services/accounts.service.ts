import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants';
import { Accounts, H2HAccounts } from '@models/accounts';
import { Messages, NewMessage } from '@models/messages';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  public apiURL = Constants.apiRoot + 'Message';

  constructor(private httpClient: HttpClient) {}

  public getAccountsByCompany(company: string) {
    return this.httpClient.get<Accounts[]>(`${this.apiURL}/GetAllAccounts?companyId=${company}`);
  }

  public getMessagesByAccount(account: string) {
    return this.httpClient.get<Messages[]>(`${this.apiURL}/GetMessagesForAccount?accountId=${account}`);
  }

  public postNewMessage(message: NewMessage) {
    return this.httpClient.post<NewMessage>(`${this.apiURL}/SendSms`, message);
  }

  public hasArchivedMessages(account: string) {
    return this.httpClient.get<boolean>(`${this.apiURL}/HasArchivedMessages?accountId=${account}`);
  }

  public getArchivedMessagesByAccount(account: string) {
    return this.httpClient.get<Messages[]>(`${this.apiURL}/GetArchivedMessagesForAccount?accountId=${account}`);
  }

  public getH2HByCompany(companyId: string) {
    return this.httpClient.get<H2HAccounts[]>(`${this.apiURL}/GetAllH2HAccounts?companyId=${companyId}`);
  }

}
