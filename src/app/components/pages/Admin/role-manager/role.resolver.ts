import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { of } from 'rxjs';
import { IResult } from '../../../../models/result';
import { IRole } from '../../../../models/Role/role';
import { ErrorHandlerService } from '../../../../services/errorHandling.service';
import { RoleService } from '../services/role.services';

@Injectable()
export class RolesResolverService implements Resolve<IResult<IRole[]>> {
  constructor(private dataService: RoleService, private errorHandler: ErrorHandlerService) {}

  resolve() {
    try {
      return this.dataService.getRoles();
    } catch (error) {
      this.errorHandler.handleError(error);
      return of({ Data: [], errorMessage: error });
    }
  }
}
