import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { SystemLogComponent } from './system-log/system-log.component';
import { TwilioAccountComponent } from './twilio-account/twilio-account.component';
import { AdminLayoutComponent } from './adminlayout/adminlayout.component';
import { LogResolverService } from './system-log/system-log-resolver.service';
import { SettingsResolverService, SettingNamesResolverService } from './system-settings/system-settings-resolver.service';
import { TwilioAccountResolverService } from './twilio-account/twilio-account-resolver.service';
import { UnknownMessagesComponent } from './unknown-messages/unknown-messages.component';
import { UnknownMessageResolverService } from './unknown-messages/unknown-messages.resolver.service';
import { FailedMessagesComponent } from './failed-messages/failed-messages.component';
import { FailedMessageResolverService } from './failed-messages/failed-messages.resolver.service';
import { InvalidMessagesComponent } from './invalid-messages/invalid-messages.component';
import { InvalidMessageResolverService } from './invalid-messages/invalid-message.resolver.service';
import { RoleManagerComponent } from './role-manager/role-manager.component';
import { RolesResolverService as RolesResolver } from './role-manager/role.resolver';
import { RoleGuardService } from '../../../services/roleGuardService';
import { ReservedCommandsComponent } from './reserved-commands/reserved-commands.component';
import { CommandsResolverService } from './reserved-commands/reserved-commands-resolver.service';

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'settings',
        component: SystemSettingsComponent,
        resolve: {
          settings: SettingsResolverService,
          names: SettingNamesResolverService,
        },
      },
      {
        path: 'log',
        component: SystemLogComponent,
        resolve: {
          logs: LogResolverService,
        },
      },
      {
        path: 'twiliaccount',
        component: TwilioAccountComponent,
        resolve: {
          twilioAccounts: TwilioAccountResolverService,
        },
      },
      {
        path: 'commands',
        component: ReservedCommandsComponent,
        resolve: {
          resolvedCommands: CommandsResolverService,
        },
      },
      {
        path: 'unknown',
        component: UnknownMessagesComponent,
        resolve: {
          umessages: UnknownMessageResolverService,
        },
      },
      {
        path: 'failed',
        component: FailedMessagesComponent,
        resolve: {
          fmessages: FailedMessageResolverService,
        },
      },
      {
        path: 'invalid',
        component: InvalidMessagesComponent,
        resolve: {
          imessages: InvalidMessageResolverService,
        },
      },
      {
        path: 'roles',
        component: RoleManagerComponent,
        canActivate: [RoleGuardService],
        data: { title: 'Role Management', claim: 'OmniChannel.Role.ViewRoles' },
        resolve: {
          roles: RolesResolver,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
