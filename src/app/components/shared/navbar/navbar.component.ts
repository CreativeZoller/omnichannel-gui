import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuthService } from '@okta/okta-angular';
import { ConfirmDialogService } from '@services/confirmDialog.service';
import { LocalSessionService } from '@services/localSession.service';
import { PersistService } from '@services/persist.service';
import { SignalRService } from '@services/signalr.service';
import { Subscription } from 'rxjs';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { UserClaim } from '../../../models/UserClaim';
import { AdminService } from '../../../services/admin.services';
import { NotificationService } from '@services/notification.service';
import { Messages } from '@models/messages';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RequestSnackbarComponent } from '../request-snackbar/request-snackbar.component';
import { RoleGuardService } from '@services/roleGuardService';

@Component({
  selector: 'vt-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent extends OnDestroyMixin implements OnInit {
  @Output() toggleEvent = new EventEmitter<boolean>();
  public toggle = false;
  public hidden = false;
  userClaim: UserClaim;
  public loading = true;
  isAuthenticated: boolean;
  public usr: UserClaim;
  public errorMessage = '';
  public successMessage = '';
  roleVisible = false;
  showMenu = false;
  agentId = '';
  signalDataSubscribe: Subscription;
  accountMessages: Messages[];

  constructor(
    public router: Router,
    public oktaAuth: OktaAuthService,
    private localSessionService: LocalSessionService,
    private dialogService: ConfirmDialogService,
    private store: PersistService,
    private signal: SignalRService,
    private notify: NotificationService,
    private admin: AdminService,
    private roleGuard: RoleGuardService,
    private snackbar: MatSnackBar,
  ) {
    super();
    this.usr = this.store.get<UserClaim>('user');
    if (this.usr == null || this.usr == undefined) this.localSessionService.start();
    this.oktaAuth.$authenticationState.subscribe((isAuthenticated: boolean) => (this.isAuthenticated = isAuthenticated));
    this.userClaim = this.usr;
  }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    if (this.isAuthenticated) {
      if (!this.userClaim) {
        this.localSessionService.start();
        this.localSessionService.user.pipe(untilComponentDestroyed(this)).subscribe((user: UserClaim) => {
          if (user) {
            this.userClaim = user;
            this.loading = false;
          }
        });
      }
    } else {
      this.localSessionService.endAndLogout();
    }

    this.setRole();
    this.agentId = this.store.get<string>('agentId') ?? '';

    this.listenForUpdates();
  }

  checkRole(role: string): boolean
  {
    return this.roleGuard.hasClaim(role);
  }

  setRole() {
    const user = this.store.get<UserClaim>('user');
    if (user === undefined || user == null) {
      setTimeout(() => {
        this.setRole();
      }, 300);
    }
    this.roleVisible = user?.Claims?.indexOf('OmniChannel.Role.ViewRoles') > -1 ?? false;
    this.showMenu = true;
  }

  openDialog() {
    const dialogOptions = {
      title: 'Are You ready to leave?',
      message: 'Select "Logout" below if you are ready to end your current session.',
      cancelText: 'Cancel',
      confirmText: 'Logout',
    };
    this.dialogService.open(dialogOptions);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.logout();
      }
    });
  }

  toggleBoolean(): void {
    this.toggle = !this.toggle;
  }

  checkNestedMenus(): void {
    const wrapper = document.querySelector('.wrapper');
    if (wrapper.classList.contains('toggled')) {
      const nestedMenus = document.querySelectorAll('.mp-level.active');
      if (nestedMenus.length > 0) {
        for (const key of Object.keys(nestedMenus)) {
          const menuLevel = nestedMenus[key];
          menuLevel.classList.toggle('active');
        }
      }
    }
  }

  async getToken() {
    const token = 'Bearer ' + (await this.oktaAuth.getAccessToken());
    this.copyText(token);
    this.errorMessage = '';
    this.successMessage = 'Successfully copied token to clipboard';
    this.open('window');
  }

  /* To copy any Text */
  copyText(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  public close(component) {
    this[component + 'Opened'] = false;
  }

  public open(component) {
    this[component + 'Opened'] = true;
  }

  toggleParentClass(): void {
    this.checkNestedMenus();
    this.hidden = !this.hidden;
    this.toggleEvent.emit(this.hidden);
  }

  logout() {
    this.signalDataSubscribe?.unsubscribe();
    this.signalDataSubscribe = null;

    this.localSessionService.endAndLogout();
  }

  changeCompany() {
    if (this.agentId === '' || this.agentId === undefined || this.agentId === null) {
      alert('Agent Id is not specified!');
      return;
    }

    this.admin.getCompanyIdForAgent(this.agentId).subscribe((result) => {
      if (result.CompanyName === '' || result.CompanyName === undefined || result.CompanyName === null) {
        alert('Company change failed, company not found based on agent id! ');
        return;
      }
      this.store.set<UserClaim>('user', result);
      this.store.set<string>('agentId', this.agentId);
      window.location.reload();
    });
  }

  resetCompany() {
    this.admin.getDefaultUserClaim().subscribe((result) => {
      this.store.set<UserClaim>('user', result);
      this.agentId = '';
      this.store.set<string>('agentId', this.agentId);
      window.location.reload();
    });
  }

  listenForUpdates() {
    if (this.signalDataSubscribe && !this.signalDataSubscribe.closed) return;
    this.signalDataSubscribe = this.signal.data.subscribe((data: any) => {
      const messageUpdates = this.accountMessages;
      if (data.data.errorMessage === '') {
        const newMessage = new Messages();
        newMessage.Content = data.data.content;
        newMessage.Direction = data.data.direction;
        const inbound = data.data.direction.toLowerCase().indexOf('inbound');
        const chatContent = data.data.content;
        const chatRegExp = /[a-zA-Z]+\s+[a-zA-Z]+/g;
        if (inbound >= 0) {
          if (chatRegExp.test(chatContent)) {
            if (!chatContent.toLowerCase().includes('switch')) {
              this.snackbar.openFromComponent(RequestSnackbarComponent, { horizontalPosition: "center", duration: 10000 });
            }
          } else {
            if (chatContent.toLowerCase().includes('chat')) {
              this.snackbar.openFromComponent(RequestSnackbarComponent, { horizontalPosition: "center", duration: 10000 });
            }
          }
        }
      }
    });
    this.signal.startListening('accountMessages');
  }
}
