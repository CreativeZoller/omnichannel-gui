import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OktaAuthService } from '@okta/okta-angular';
import { PersistService } from '../../../services/persist.service';
import { UserClaim } from '../../../models/UserClaim';
import { AdminService } from '../../../services/admin.services';
import { LocalSessionService } from '../../../services/localSession.service';

@Component({
  selector: 'vt-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  pageTitle: any;
  isAuthenticated: boolean;

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    public oktaAuth: OktaAuthService,
    private localSessionService: LocalSessionService
  ) {
    this.oktaAuth.$authenticationState.subscribe((isAuthenticated: boolean) => (this.isAuthenticated = isAuthenticated));
  }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    if (this.isAuthenticated) {
      this.localSessionService.start();
      this.router.navigate(['/dashboard']);
    }

    this.activatedroute.data.subscribe((data) => {
      this.pageTitle = data.pageTitle;
    });
  }

  login() {
    this.oktaAuth.loginRedirect('/dashboard');
  }
}
