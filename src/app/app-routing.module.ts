import { RoleGuardService } from './services/roleGuardService';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OktaCallbackComponent, OktaAuthGuard, OktaLoginRedirectComponent } from '@okta/okta-angular';
import { Constants } from './constants';
import { AdminModule } from '@admin/admin.module';
import { PageNotFoundPageComponent } from '@pagenotfound/pagenotfound-page.component';
import { CommunicationsPageComponent } from '@communications/communications-page.component';
import { CommunicationsRequestPageComponent } from '@requests/communications-request-page.component';
import { DashboardPageComponent } from '@dashboard/dashboard-page.component';
import { LandingPageComponent } from '@landing/landing-page.component';
import { CommandsPageComponent } from '@commands/commands-page.component';
import { CommunicationsPageResolverService } from '@communications/communications-page-resolver.service';
import { CommunicationsRequestPageResolverService } from '@requests/communications-request-page-resolver.service';
import { CommandsPageResolverService } from '@commands/commands-page-resolver.service';
import { CommandsSearchPageComponent } from './components/pages/commands-search-page/commands-search-page.component';
import { VerificationToolsComponent } from './components/pages/verification-tools-page/verification-tools.component';
import { VerificationResolverService } from './components/pages/verification-tools-page/verification-tools-resolver.service';
import { CommunicationTemplatesComponent } from './components/pages/communication-templates-page/communication-templates.component';
import { CommunicationTemplatesComponentResolverService } from './components/pages/communication-templates-page/communication-templates-page-resolver.service';
import { ManageUsersPageComponent } from '@pages/manage-users-page/manage-users-page.component';
import { ManageUsersResolverService } from '@pages/manage-users-page/manage-users-resolver.service';


const appRoutes: Routes = [
  {
    path: 'login',
    component: OktaLoginRedirectComponent,
  },
  {
    path: Constants.CALLBACK_PATH,
    component: OktaCallbackComponent,
    canActivateChild: [OktaAuthGuard],
  },
  {
    path: 'landing',
    component: LandingPageComponent,
    data: {
      pageTitle: 'Landing page',
    },
    canActivateChild: [OktaAuthGuard],
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    canActivate: [OktaAuthGuard],
    data: {
      pageTitle: 'Dashboard',
      breadcrumb: 'Dashboard',
    },
    canActivateChild: [OktaAuthGuard],
  },
  {
    path: 'generaltesting',
    component: DashboardPageComponent,
    canActivate: [OktaAuthGuard],
    data: {
      pageTitle: 'General test component',
      breadcrumb: 'General test component',
    },
    canActivateChild: [OktaAuthGuard],
  },
  {
    path: 'communications',
    component: CommunicationsPageComponent,
    canActivate: [RoleGuardService],
    resolve: {
      debtorList: CommunicationsPageResolverService,
    },
    data: {
      pageTitle: 'Communications',
      breadcrumb: 'Communications',
      claim: 'OmniChannel.Communications.View',
    },
    canActivateChild: [OktaAuthGuard],
  },
  {
    path: 'requests',
    component: CommunicationsRequestPageComponent,
    canActivate: [OktaAuthGuard],
    resolve: {
      debtorList: CommunicationsRequestPageResolverService,
    },
    data: {
      pageTitle: 'Requests',
      breadcrumb: 'Requests'
    },
    canActivateChild: [OktaAuthGuard],
  },
  {
    path: 'commands',
    component: CommandsPageComponent,
    canActivate: [RoleGuardService],
    resolve: {
      commandsList: CommandsPageResolverService,
    },
    data: {
      pageTitle: 'Command lists',
      breadcrumb: 'Command lists',
      claim : 'OmniChannel.Commands.View'
    },
    canActivateChild: [OktaAuthGuard],
  },
  {
    path: 'commandsearch',
    component: CommandsSearchPageComponent,
    canActivate: [RoleGuardService],
    data: {
      pageTitle: 'Commands search',
      breadcrumb: 'Commands search',
      claim : 'OmniChannel.Commands.View',
    },
    canActivateChild: [OktaAuthGuard],
  },
  {
    path: 'communication-templates',
    component: CommunicationTemplatesComponent,
    canActivate: [OktaAuthGuard],
    resolve: {
      templateData: CommunicationTemplatesComponentResolverService,
    },
    data: {
      pageTitle: 'Communication templates',
      breadcrumb: 'Communication templates',
      resolverId: '1',
    },
    canActivateChild: [OktaAuthGuard],
  },
  {
    path: 'verification',
    component: VerificationToolsComponent,
    canActivate: [RoleGuardService],
    resolve: {
      verificationData: VerificationResolverService,
    },
    data: {
      pageTitle: 'Verification tool',
      breadcrumb: 'Verification tool',
      claim : 'OmniChannel.VerificationTool.View',
    },
    canActivateChild: [OktaAuthGuard],
  },
  {
    path: 'manageusers',
    component: ManageUsersPageComponent,
    canActivate: [OktaAuthGuard],
    resolve: {
      userData: ManageUsersResolverService,
    },
    data: {
      pageTitle: 'Manage Users',
      breadcrumb: 'Manage Users',
    },
    canActivateChild: [OktaAuthGuard],
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: PageNotFoundPageComponent,
    data: {
      pageTitle: 'Page Not Found',
      breadcrumb: 'Page Not Found',
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // only for debugging
    ),
    AdminModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
