import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../constants';
import { IFailedMessage } from '../models/failedMessages';
import { IInvalidMessage } from '../models/invalidMessage';
import { ILog } from '../models/log';
import { ISelectItem } from '../models/selectItem';
import { ISettings } from '../models/settings';
import { ITwilioAccount } from '../models/twilioAccount';
import { ITwilioAccountRequest } from '../models/twilioAccountRequest';
import { IUnknownMessage } from '../models/unknownMessage';
import { UserClaim } from '../models/UserClaim';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiURL = Constants.apiRoot;

  constructor(private httpClient: HttpClient) {}

  public getLogs(level: string, from: string) {
    return this.httpClient.get<ILog[]>(`${this.apiURL}Log/GetLogs?level=${level}&from=${from}`);
  }

  async getUserClaimAsync(): Promise<UserClaim> {
    const response = await this.httpClient
      .get(`${Constants.apiRoot}CompanyUser/GetUserClaim`, { observe: 'response' })
      .toPromise()
      .then((_) => _ as HttpResponse<UserClaim>);
    if (response === null || response === undefined || response.body === null || response.body === undefined) {
      return null;
    }
    const resp = response.body;
    const uc: UserClaim = {
      FullName: resp.FullName,
      UserName: resp.UserName.trim(),
      CompanyId: resp.CompanyId,
      CompanyName: resp.CompanyName.trim(),
      Company_Type: resp.Company_Type.trim(),
      VT_Employee: resp.VT_Employee,
      Claims: resp.Claims,
    };
    return uc;
  }

  async getUserClaimForAgentAsync(agentId: string): Promise<UserClaim> {
    const response = await this.httpClient
      .get(`${this.apiURL}CompanyUser/${agentId}/GetCompanyForAgentId`, { observe: 'response' })
      .toPromise()
      .then((_) => _ as HttpResponse<UserClaim>);
    if (response === null || response === undefined || response.body === null || response.body === undefined) {
      return null;
    }
    const resp = response.body;
    const uc: UserClaim = {
      FullName: resp.FullName,
      UserName: resp.UserName.trim(),
      CompanyId: resp.CompanyId,
      CompanyName: resp.CompanyName.trim(),
      Company_Type: resp.Company_Type.trim(),
      VT_Employee: resp.VT_Employee,
      Claims: resp.Claims,
    };
    return uc;
  }

  public getCompanyIdForAgent(agentId: string) {
    return this.httpClient.get<UserClaim>(`${this.apiURL}CompanyUser/${agentId}/GetCompanyForAgentId`);
  }

  public getDefaultUserClaim() {
    return this.httpClient.get<UserClaim>(`${this.apiURL}CompanyUser/GetUserClaim`);
  }

  public getSettings(companyId: string) {
    return this.httpClient.get<ISettings[]>(`${this.apiURL}SystemSettings/${companyId}/Settings`);
  }

  public getSettingNames() {
    return this.httpClient.get<ISelectItem<number>[]>(`${this.apiURL}SystemSettings/GetSettingNames`);
  }

  public createSetting(companyId: string, settingTypeValue: number, value: string) {
    return this.httpClient.post(`${this.apiURL}SystemSettings/${companyId}/Setting`, { SettingTypeValue: settingTypeValue, Value: value });
  }

  public updateSetting(companyId: string, settingsId: number, settingTypeValue: number, value: string) {
    return this.httpClient.put(`${this.apiURL}SystemSettings/${companyId}/Setting/${settingsId}`, {
      SettingTypeValue: settingTypeValue,
      Value: value,
    });
  }

  public deleteSetting(companyId: string, settingsId: number) {
    return this.httpClient.delete(`${this.apiURL}SystemSettings/${companyId}/Setting/${settingsId}`);
  }

  public getTwilioAccounts(companyId: string) {
    return this.httpClient.get<ITwilioAccount[]>(`${this.apiURL}TwilioAccount/${companyId}/TwilioAccounts`);
  }

  public createTwilioAccount(companyId: string, request: ITwilioAccountRequest) {
    return this.httpClient.post(`${this.apiURL}TwilioAccount/${companyId}/TwilioAccount`, request);
  }

  public updateTwilioAccount(companyId: string, request: ITwilioAccountRequest) {
    return this.httpClient.put(`${this.apiURL}TwilioAccount/${companyId}/TwilioAccount/${request.AccountSid}`, request);
  }

  public deleteTwilioAccount(companyId: string, accountSid: string) {
    return this.httpClient.delete(`${this.apiURL}TwilioAccount/${companyId}/TwilioAccount/${accountSid}`);
  }

  public getUnknownMessages(companyId: string, from: string, to: string) {
    let params = new HttpParams();
    params = params.append('from', from);
    params = params.append('to', to);
    return this.httpClient.get<IUnknownMessage[]>(`${this.apiURL}Log/${companyId}/GetUnknownMessages`, { params: params });
  }

  public getFailedMessages(from: string, to: string) {
    let params = new HttpParams();
    params = params.append('from', from);
    params = params.append('to', to);
    return this.httpClient.get<IFailedMessage[]>(`${this.apiURL}Log/GetFailedMessages`, { params: params });
  }

  public getInvalidMessages(from: string, to: string) {
    let params = new HttpParams();
    params = params.append('from', from);
    params = params.append('to', to);
    return this.httpClient.get<IInvalidMessage[]>(`${this.apiURL}Log/GetInvalidMessages`, { params: params });
  }
}
