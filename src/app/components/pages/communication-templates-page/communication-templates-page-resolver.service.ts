import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { messageTemplate } from '@models/messageTemplate';
import { PersistService } from '../../../services/persist.service';
import { UserClaim } from '../../../models/UserClaim';
import { MessageTemplateService } from '@services/messageTemplate.service';

@Injectable()
export class CommunicationTemplatesComponentResolverService implements Resolve<messageTemplate[]> {
  constructor(
    private router: Router,
    private templates: MessageTemplateService,
    private store: PersistService
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const usr = this.store.get<UserClaim>('user');
    try {
      return this.templates.getTemplatesByCompany(usr.CompanyId);
    } catch (error) {
      this.router.navigate(['/dashboard']);
    }
  }
}
