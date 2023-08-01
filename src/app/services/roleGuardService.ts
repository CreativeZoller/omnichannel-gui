import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OktaAuthService } from '@okta/okta-angular';
import { UserClaim } from '../models/UserClaim';
import { PersistService } from './persist.service';

@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(private oktaAuth: OktaAuthService, private router: Router, private store: PersistService) {}
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isAuthenticated = await this.oktaAuth.isAuthenticated();
    if (!isAuthenticated) return false;
    return this.hasClaim(route.data.claim);
  }

  hasClaim(claim: string) {
    try {
      const user = this.store.get<UserClaim>('user');
      if (user === null || user === undefined) return false;
      if (user.Claims === null || user.Claims === undefined || user.Claims.length < 1) return false;
      return user.Claims.indexOf(claim) > -1;
    } catch (e) {
      return false;
    }
  }
}
