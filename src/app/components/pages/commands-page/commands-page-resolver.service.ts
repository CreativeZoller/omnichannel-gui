import { Injectable } from '@angular/core';
import { CommandsService } from '@services/commands.service';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CommandList } from '@models/commands';
import { PersistService } from '../../../services/persist.service';
import { UserClaim } from '../../../models/UserClaim';

@Injectable()
export class CommandsPageResolverService implements Resolve<CommandList[]> {
  constructor(private router: Router, private commands: CommandsService, private store: PersistService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const usr = this.store.get<UserClaim>('user');
    try {
      return this.commands.getCommandListsByCompany(usr.CompanyId);
    } catch (error) {
      this.router.navigate(['/dashboard']);
    }
  }
}
