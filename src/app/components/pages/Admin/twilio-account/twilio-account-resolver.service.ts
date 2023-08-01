import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { ITwilioAccount } from '@models/twilioAccount';
import { UserClaim } from '@models/UserClaim';
import { AdminService } from '@services/admin.services';
import { PersistService } from '@services/persist.service';

@Injectable()
export class TwilioAccountResolverService implements Resolve<ITwilioAccount[]> {
  constructor(private router: Router, private adminService: AdminService, private store: PersistService) {}

  resolve() {
    try {
      const usr = this.store.get<UserClaim>('user');
      return this.adminService.getTwilioAccounts(usr.CompanyId);
    } catch (error) {
      this.router.navigate(['/dashboard']);
    }
  }
}
