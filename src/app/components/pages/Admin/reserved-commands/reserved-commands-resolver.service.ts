import { Injectable } from "@angular/core";
import { Resolve, Router } from "@angular/router";
import { ISettings } from "@models/settings";
import { UserClaim } from "@models/UserClaim";
import { PersistService } from "@services/persist.service";
import { ReservedCommandsService } from "@services/reservedCommands.service";


@Injectable()
export class CommandsResolverService implements Resolve<ISettings[]> {
  constructor (
    private router: Router,
    private reservedService: ReservedCommandsService,
    private store: PersistService
    ) {}

  resolve() {
    try {
      const usr = this.store.get<UserClaim>('user');
      return this.reservedService.getReservedCommands(usr.CompanyId);
    } catch (error) {
      this.router.navigate(['/dashboard']);
    }
  }
}