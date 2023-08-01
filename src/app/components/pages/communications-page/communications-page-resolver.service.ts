import { Injectable } from '@angular/core';
import { AccountsService } from '@services/accounts.service';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Accounts } from '@models/accounts';
import { PersistService } from '../../../services/persist.service';
import { UserClaim } from '../../../models/UserClaim';

@Injectable()
export class CommunicationsPageResolverService implements Resolve<Accounts[]> {
  constructor(private router: Router, private accounts: AccountsService, private store: PersistService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const usr = this.store.get<UserClaim>('user');
    try {
      return this.accounts.getAccountsByCompany(usr.CompanyId);
    } catch (error) {
      this.router.navigate(['/dashboard']);
    }
  }
}
