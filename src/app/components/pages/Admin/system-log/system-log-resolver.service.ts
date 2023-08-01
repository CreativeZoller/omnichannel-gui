import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { ILog } from '@models/log';
import { AdminService } from '@services/admin.services';

@Injectable()
export class LogResolverService implements Resolve<ILog[]> {
  constructor(private router: Router, private adminService: AdminService) {}

  resolve() {
    try {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();

      return this.adminService.getLogs('', yyyy + '-' + mm + '-' + dd);
    } catch (error) {
      this.router.navigate(['/dashboard']);
    }
  }
}
