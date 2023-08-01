import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { manageableUser } from '@models/manageableUsers';
import { UserClaim } from '@models/UserClaim';
import { ManageUsersService } from '@services/manageUsers.service';
import { PersistService } from '@services/persist.service';

@Injectable({
  providedIn: 'root'
})
export class ManageUsersResolverService implements Resolve<manageableUser[]> {

  constructor(
    private router: Router,
    private users: ManageUsersService,
    private store: PersistService)
    { }

  resolve(route: ActivatedRouteSnapshot) {
    const usr = this.store.get<UserClaim>('user');
    try {
      return this.users.getAllUsersByCompany(usr.CompanyId);
    } catch (error) {
      this.router.navigate(['/dashboard']);
    }
  }
}
