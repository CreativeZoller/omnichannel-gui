// basic & project specific Angular modules
import { AppComponent } from './app.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// project specific custom modules & 3rd party modules
import { AppRoutingModule } from './app-routing.module';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularMaterialModule } from './angular-material.module';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { OKTA_CONFIG, OktaAuthModule } from '@okta/okta-angular';
import { CountdownModule } from 'ngx-countdown';
import { Constants } from './constants';
import { MentionModule } from 'angular-mentions';
import { ChartsModule } from 'ng2-charts';
// other project specific modules
import { AdminModule } from '@admin/admin.module';
import { LandingPageComponent } from '@landing/landing-page.component';
import { DashboardPageComponent } from '@dashboard/dashboard-page.component';
import { CommunicationsPageComponent } from '@communications/communications-page.component';
import { CommunicationsRequestPageComponent } from '@requests/communications-request-page.component';
import { CommandsPageComponent } from '@commands/commands-page.component';
import { CommandsSearchPageComponent } from '@commands-search/commands-search-page.component';
import { VerificationToolsComponent } from '@verification/verification-tools.component';
import { PageNotFoundPageComponent } from '@pagenotfound/pagenotfound-page.component';
import { CommandDetailsPageComponent } from '@details-commands/command-details-page.component';
import { CommunicationsPageResolverService } from '@communications/communications-page-resolver.service';
import { CommunicationsRequestPageResolverService } from '@requests/communications-request-page-resolver.service';
import { CommandsPageResolverService } from '@commands/commands-page-resolver.service';
import { EditCommandlistFormComponent } from '@form-commandlist/edit-commandslist-form.component';
import { EditCommandFormComponent } from '@form-command/edit-command-form.component';
import { VerificationMessageFormComponent } from '@verification/verification-message-form/verification-message-form.component';
import { VerificationQuestionFormComponent } from '@verification/verification-questions-form/verification-questions-form.component';
import { SharedModule } from '@shared-model';
import { ConfirmDialogComponent } from '@dialog/confirm-dialog.component';
import { AccountCountIntervalComponent } from './components/pages/dashboard-page/widgets/account-count-interval/account-count-interval.component';
import { CommandStatisticComponent } from './components/pages/dashboard-page/widgets/command-statistic/command-statistic.component';
import { H2hLatestComponent } from './components/pages/dashboard-page/widgets/h2h-latest/h2h-latest.component';
import { FailedMessagesComponent } from './components/pages/dashboard-page/widgets/failed-messages/failed-messages.component';
import { LatestMessagesComponent } from './components/pages/dashboard-page/widgets/latest-messages/latest-messages.component';
import { MessageRateComponent } from './components/pages/dashboard-page/widgets/message-rate/message-rate.component';
import { MessageCountLastMonthComponent } from './components/pages/dashboard-page/widgets/message-count-last-month/message-count-last-month.component';
import { RequestSnackbarComponent } from './components/shared/request-snackbar/request-snackbar.component';
import { CommunicationTemplatesComponent } from './components/pages/communication-templates-page/communication-templates.component';
import { EditCommunicationTemplateFormComponent } from './components/shared/edit-communication-template-form/edit-communication-template-form.component';
import { ManageUsersPageComponent } from './components/pages/manage-users-page/manage-users-page.component';
import { ManageUsersResolverService } from './components/pages/manage-users-page/manage-users-resolver.service';
import { ManageUsersFormComponent } from '@pages/manage-users-page/manage-users-form/manage-users-form.component';
//services
import { VexHttpInterceptor } from '@services/vexhttpinterceptor.service';
import { OktaAuthGuard } from '@services/oktaAuthguard.service';
import { OktaAPIService } from '@services/oktaApi.service';
import { PersistService } from '@services/persist.service';
import { SignalRService } from '@services/signalr.service';
import { NotificationService } from '@services/notification.service';
import { LocalSessionService } from '@services/localSession.service';
import { ErrorHandlerService } from '@services/errorHandling.service';
import { ConfirmDialogService } from '@services/confirmDialog.service';
import { SessionStorageService } from '@services/storageSession.service';
import { FormCheckingService } from '@services/form.check.service';
import { DashboardService } from './services/dashboard.service';
import { RoleGuardService } from './services/roleGuardService';
import { RoleService } from './components/pages/Admin/services/role.services';
import { MessageTemplateService } from '@services/messageTemplate.service';
import { CommunicationTemplatesComponentResolverService } from './components/pages/communication-templates-page/communication-templates-page-resolver.service';
import { ManageUsersService } from '@services/manageUsers.service';

const oktaConfig = {
  issuer: Constants.issuer,
  redirectUri: Constants.redirectUri,
  clientId: Constants.clientId,
  scopes: ['openid', 'profile', 'email'],
  tokenManager: {
    secure: true,
  },
  pkce: false,
};

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    DashboardPageComponent,
    CommunicationsPageComponent,
    CommunicationsRequestPageComponent,
    PageNotFoundPageComponent,
    CommandsPageComponent,
    CommandsSearchPageComponent,
    PageNotFoundPageComponent,
    EditCommandlistFormComponent,
    EditCommandFormComponent,
    VerificationMessageFormComponent,
    VerificationQuestionFormComponent,
    CommandDetailsPageComponent,
    AccountCountIntervalComponent,
    CommandStatisticComponent,
    H2hLatestComponent,
    FailedMessagesComponent,
    LatestMessagesComponent,
    MessageRateComponent,
    MessageCountLastMonthComponent,
    VerificationToolsComponent,
    RequestSnackbarComponent,
    CommunicationTemplatesComponent,
    EditCommunicationTemplateFormComponent,
    ManageUsersPageComponent,
    ManageUsersFormComponent,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    AppRoutingModule,
    HttpClientModule,
    NgIdleKeepaliveModule.forRoot(),
    OktaAuthModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CountdownModule,
    AdminModule,
    SharedModule,
    MentionModule,
    ChartsModule,
  ],
  providers: [
    { provide: OKTA_CONFIG, useValue: oktaConfig },
    NotificationService,
    ConfirmDialogService,
    LocalSessionService,
    ErrorHandlerService,
    SessionStorageService,
    FormCheckingService,
    OktaAPIService,
    PersistService,
    SignalRService,
    DashboardService,
    OktaAuthGuard,
    RoleGuardService,
    RoleService,
    NgbActiveModal,
    NgIdleKeepaliveModule,
    CommunicationsPageResolverService,
    CommunicationsRequestPageResolverService,
    CommandsPageResolverService,
    ManageUsersResolverService,
    ManageUsersService,
    { provide: HTTP_INTERCEPTORS, useClass: VexHttpInterceptor, multi: true },
    ConfirmDialogComponent,
    MessageTemplateService,
    CommunicationTemplatesComponentResolverService,
    MentionModule,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [RequestSnackbarComponent],
})
export class AppModule {}
