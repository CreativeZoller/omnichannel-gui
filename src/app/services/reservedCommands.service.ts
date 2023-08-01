import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants';
import { ReservedCommand } from '@models/commands';

@Injectable({
  providedIn: 'root',
})
export class ReservedCommandsService {
  public apiURL = Constants.apiRoot + 'ReservedCommand';

  constructor(private httpClient: HttpClient) {}

  public getReservedCommands(companyId: string) {
    return this.httpClient.get<any>(`${this.apiURL}/GetReservedCommands?companyId=${companyId}`);
  }

  public deleteReservedCommand(commandId: string) {
    return this.httpClient.delete(`${this.apiURL}/ReservedDeleteCommand?reservedCommandId=${commandId}`);
  }

  public addReservedCommand(changedCommand: ReservedCommand) {
    return this.httpClient.post<ReservedCommand>(`${this.apiURL}/AddReservedCommand`, changedCommand);
  }

  public updateReservedCommand(changedCommand: ReservedCommand) {
    return this.httpClient.put<ReservedCommand>(`${this.apiURL}/UpdateReservedCommand`, changedCommand);
  }
}