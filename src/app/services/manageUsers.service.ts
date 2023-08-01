import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants';
import { manageableUser, cancellableUser } from '@models/manageableUsers';

@Injectable({
  providedIn: 'root'
})
export class ManageUsersService {
  public apiURL = Constants.apiRoot + 'ManageUsers';

  constructor(private httpClient: HttpClient) {}

  public getAllUsersByCompany(companyId: string) {
    return this.httpClient.get<manageableUser[]>(`${this.apiURL}/GetAllUsers?companyId=${companyId}`);
  }

  public unlockUser(userToChange: cancellableUser) {
    return this.httpClient.put<cancellableUser>(`${this.apiURL}/UnlockUser`, userToChange);
  }

  public cancelUser(userToChange: cancellableUser) {
    return this.httpClient.put<cancellableUser>(`${this.apiURL}/CancelUserOptOut`, userToChange);
  }
}
