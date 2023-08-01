import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { AdminService } from '../../../../services/admin.services';
import { IUnknownMessage } from '../../../../models/unknownMessage';
import { PersistService } from '@services/persist.service';
import { UserClaim } from '@models/UserClaim';

@Injectable()
export class UnknownMessageResolverService implements Resolve<IUnknownMessage[]> {
  constructor(private router: Router, private adminService: AdminService, private store: PersistService) {}

  resolve() {
    try {
      const usr = this.store.get<UserClaim>('user');
      let from: Date = new Date();
      const to: Date = new Date();
      from.setDate(from.getDate() - 1);
      const dd = String(from.getDate()).padStart(2, '0');
      const mm = String(from.getMonth() + 1).padStart(2, '0');
      const yyyy = from.getFullYear();

      const dd2 = String(to.getDate()).padStart(2, '0');
      const mm2 = String(to.getMonth() + 1).padStart(2, '0');
      const yyyy2 = to.getFullYear();

      return this.adminService.getUnknownMessages(usr.CompanyId, yyyy + '-' + mm + '-' + dd, yyyy2 + '-' + mm2 + '-' + dd2);
    } catch (error) {
      this.router.navigate(['/dashboard']);
    }
  }
}
