import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { ISelectItem } from '@models/selectItem';
import { ISettings } from '@models/settings';
import { UserClaim } from '@models/UserClaim';
import { AdminService } from '@services/admin.services';
import { PersistService } from '@services/persist.service';

@Injectable()
export class SettingsResolverService implements Resolve<ISettings[]> {
  constructor(private router: Router, private adminService: AdminService, private store: PersistService) {}

  resolve() {
    try {
      const usr = this.store.get<UserClaim>('user');
      return this.adminService.getSettings(usr.CompanyId);
    } catch (error) {
      this.router.navigate(['/dashboard']);
    }
  }
}

@Injectable()
export class SettingNamesResolverService implements Resolve<ISelectItem<number>[]> {
  constructor(private router: Router, private adminService: AdminService) {}
  resolve() {
    try {
      return this.adminService.getSettingNames();
    } catch (error) {
      this.router.navigate(['/dashboard']);
    }
  }
}
