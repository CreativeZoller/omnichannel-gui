import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants';
import { CommandList, UpdatingCommandList, CommandDetails } from '@models/commands';

@Injectable({
  providedIn: 'root',
})
export class CommandsService {
  public apiURL = Constants.apiRoot + 'Command';

  constructor(private httpClient: HttpClient) {}

  public getCommandListsByCompany(company: string) {
    return this.httpClient.get<CommandList[]>(`${this.apiURL}/GetCommandLists?companyId=${company}`);
  }

  public addCommandsList(commandlist: any) {
    return this.httpClient.post<UpdatingCommandList[]>(`${this.apiURL}/AddCommandList`, commandlist);
  }

  public updateCommandsList(commandlist: any) {
    return this.httpClient.put<UpdatingCommandList[]>(`${this.apiURL}/UpdateCommandList`, commandlist);
  }

  public deleteCommandsList(commandListId: number) {
    return this.httpClient.delete(`${this.apiURL}/DeleteCommandList?commandListId=${commandListId}`);
  }

  public getCommandsInList(commandlist: number) {
    return this.httpClient.get<CommandDetails[]>(`${this.apiURL}/GetCommands?commandListId=${commandlist}`);
  }

  public addCommandInList(command: any) {
    return this.httpClient.post<CommandDetails>(`${this.apiURL}/AddCommand`, command);
  }

  public updateCommandInList(command: any) {
    return this.httpClient.put<CommandDetails>(`${this.apiURL}/UpdateCommand`, command);
  }

  public deleteCommandInList(commandId: number) {
    return this.httpClient.delete(`${this.apiURL}/DeleteCommand?commandId=${commandId}`);
  }

  public getCommandWords() {
    return this.httpClient.get(`${this.apiURL}/GetReservedWords`);
  }

  public findCommandInList(commandName: string, company: string) {
    return this.httpClient.get(`${this.apiURL}/GetCommandsForCustomerCommand?consumerCommand=${commandName}&companyId=${company}`);
  }
}
