import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { verificationMessages } from '@models/verification';
import { PersistService } from '../../../services/persist.service';
import { UserClaim } from '../../../models/UserClaim';
import { VerificationService } from '@services/verification.service';

@Injectable({
  providedIn: 'root',
})
export class VerificationResolverService implements Resolve<verificationMessages> {
  constructor(private router: Router, private verificationMsgs: VerificationService, private store: PersistService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const usr = this.store.get<UserClaim>('user');
    try {
      return this.verificationMsgs.getVerificationMessages(usr.CompanyId);
    } catch (error) {
      this.router.navigate(['/dashboard']);
    }
  }
}
