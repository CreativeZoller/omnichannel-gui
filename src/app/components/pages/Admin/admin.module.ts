import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CountdownModule } from 'ngx-countdown';
import { AngularMaterialModule } from '../../../angular-material.module';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './adminlayout/adminlayout.component';
import { FailedMessagesComponent } from './failed-messages/failed-messages.component';
import { FailedMessageResolverService } from './failed-messages/failed-messages.resolver.service';
import { InvalidMessageResolverService } from './invalid-messages/invalid-message.resolver.service';
import { InvalidMessagesComponent } from './invalid-messages/invalid-messages.component';
import { LogResolverService } from './system-log/system-log-resolver.service';
import { SystemLogComponent } from './system-log/system-log.component';
import { SettingNamesResolverService, SettingsResolverService } from './system-settings/system-settings-resolver.service';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { TwilioAccountResolverService } from './twilio-account/twilio-account-resolver.service';
import { TwilioAccountComponent } from './twilio-account/twilio-account.component';
import { UnknownMessagesComponent } from './unknown-messages/unknown-messages.component';
import { UnknownMessageResolverService } from './unknown-messages/unknown-messages.resolver.service';
import { RoleManagerComponent } from './role-manager/role-manager.component';
import { RolesResolverService as RolesResolver } from './role-manager/role.resolver';
import { RoleDetailsComponent } from './role-manager/role-details/role-details.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommandsResolverService } from './reserved-commands/reserved-commands-resolver.service';
import { ReservedCommandsComponent } from './reserved-commands/reserved-commands.component';
import { ReservedFormComponent } from './reserved-commands/reserved-form/reserved-form.component';

@NgModule({
  declarations: [
    SystemSettingsComponent,
    SystemLogComponent,
    TwilioAccountComponent,
    AdminLayoutComponent,
    FailedMessagesComponent,
    InvalidMessagesComponent,
    UnknownMessagesComponent,
    RoleManagerComponent,
    RoleDetailsComponent,
    ReservedFormComponent,
    ReservedCommandsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    RouterModule,
    CountdownModule,
    ReactiveFormsModule,
    DragDropModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    LogResolverService,
    RolesResolver,
    SettingsResolverService,
    SettingNamesResolverService,
    TwilioAccountResolverService,
    UnknownMessageResolverService,
    FailedMessageResolverService,
    InvalidMessageResolverService,
    CommandsResolverService,
  ],
})
export class AdminModule {}
