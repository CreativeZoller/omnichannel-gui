import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants';
import { messageTemplate, updateTemplate } from '@models/messageTemplate';

@Injectable({
  providedIn: 'root',
})

export class MessageTemplateService {
  public apiURL = Constants.apiRoot + 'MessageTemplate';

  constructor(private httpClient: HttpClient) {}

  public getTemplatesByCompany(company: string) {
    return this.httpClient.get<messageTemplate[]>(`${this.apiURL}/GetMessageTemplates?companyId=${company}`);
  }

  public findMessageTemplate(company: string, templateId: string) {
    console.log(`${this.apiURL}/FindMessageTemplate?id=${templateId}?companyId=${company}`);
    return this.httpClient.get<messageTemplate>(`${this.apiURL}/FindMessageTemplate?id=${templateId}?companyId=${company}`);
  }

  public addMessageTemplate(messageTemplate: updateTemplate) {
    return this.httpClient.post<updateTemplate>(`${this.apiURL}/MessageTemplate?name=${messageTemplate.name}&text=${messageTemplate.text}&companyId=${messageTemplate.companyId}`, {});
  }

  public updateMessageTemplate(messageTemplate: updateTemplate) {
    return this.httpClient.put<updateTemplate>(`${this.apiURL}/MessageTemplate?id=${messageTemplate.id}&text=${messageTemplate.text}`, {});
  }

  public deleteMessageTemplate(templateId: string) {
    return this.httpClient.delete(`${this.apiURL}/MessageTemplate?id=${templateId}`);
  }

}
