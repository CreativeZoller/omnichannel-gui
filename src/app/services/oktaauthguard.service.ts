import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { OktaAuthService } from '@okta/okta-angular';
import { PersistService } from '@services/persist.service';
import { UserClaim } from '../models/UserClaim';
import { AdminService } from './admin.services';

@Injectable()
export class OktaAuthGuard implements CanActivate, CanActivateChild {
  isAuthenticated: boolean;
  constructor(private oktaAuth: OktaAuthService, private router: Router, private store: PersistService, private admin: AdminService) {
    this.oktaAuth.$authenticationState.subscribe((isAuthenticated) => (this.isAuthenticated = isAuthenticated));
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    if (this.isAuthenticated) {
      const user = this.store.get<UserClaim>('user');
      if (user !== null && user !== undefined && user.CompanyId !== '') {
        return true;
      } else {
        const agentId = this.store.get<string>('agentId') ?? '';
        if (agentId === undefined || agentId === null || agentId === '' || agentId === ' ') {
          return await this.getDefaultUser(user);
        } else {
          const uc = await this.admin.getUserClaimForAgentAsync(agentId);
          this.store.set<UserClaim>('user', uc);
          const res = user !== null && user !== undefined && user.CompanyId !== '';
          return !res ? await this.getDefaultUser(user) : res;
        }
      }
    }

    this.router.navigate(['/landing']);
    return false;
  }



  async canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }

  private logOut() {
    this.store.remove('user');
    this.oktaAuth.logout('/landing');
  }

  private async getDefaultUser(user: UserClaim): Promise<boolean> {
    const uc = await this.admin.getUserClaimAsync();
    this.store.set<UserClaim>('user', uc);
    return user !== null && user !== undefined && user.CompanyId !== '';
  }
}
