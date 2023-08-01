import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserClaim } from '../../../models/UserClaim';
import { LocalSessionService } from '../../../services/localSession.service';
import { PersistService } from '../../../services/persist.service';

@Component({
  selector: 'vt-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {
  pageTitle: any;
  navParentClass: boolean;
  companyId: string;
  loadWidgets = false;
  constructor(private activatedroute: ActivatedRoute, private store: PersistService) {}

  ngOnInit() {
    this.activatedroute.data.subscribe((data) => {
      this.pageTitle = data.pageTitle;
    });

    this.loadWidgets = false;
    setTimeout(() => {
      this.getUserData();
    }, 2000);
  }

  getUserData() {
    const user = this.store.get<UserClaim>('user');
    try {
      if (user === null || user.CompanyId === undefined) {
        setTimeout(() => {
          this.getUserData();
        }, 300);
      }
    } catch {
      setTimeout(() => {
        this.getUserData();
      }, 300);
    }

    if (user !== null && user.CompanyId !== undefined) {
      this.companyId = user?.CompanyId;
      this.loadWidgets = true;
    }
  }

  toggleReceive($event) {
    this.navParentClass = $event;
  }
}
