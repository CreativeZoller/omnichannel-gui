import { Injectable } from '@angular/core';
import { AccountsService } from '@services/accounts.service';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { H2HAccounts } from '@models/accounts';
import { PersistService } from '../../../services/persist.service';
import { UserClaim } from '../../../models/UserClaim';

@Injectable()
export class CommunicationsRequestPageResolverService implements Resolve<H2HAccounts[]> {
  constructor (
    private router: Router,
    private accounts: AccountsService,
    private store: PersistService
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const usr = this.store.get<UserClaim>('user');
    try {
      return this.accounts.getH2HByCompany(usr.CompanyId);
    } catch (error) {
      this.router.navigate(['/dashboard']);
    }
  }
}
