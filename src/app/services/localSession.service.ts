import { Injectable } from '@angular/core';
import { OktaAuthService, UserClaims } from '@okta/okta-angular';
import { BehaviorSubject } from 'rxjs';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { PersistService } from '@services/persist.service';
import { ConfirmDialogService } from '@services/confirmDialog.service';
import { UserClaim } from '../models/UserClaim';
import { AdminService } from './admin.services';

@Injectable()
export class LocalSessionService {
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  private idleTime = 900; // 15 minutes
  private timeOutTime = 120; // 2 minutes
  private keepaliveIntervalTime = 900; // 15 minutes

  private newUser!: UserClaim;
  private userB: BehaviorSubject<UserClaim> = new BehaviorSubject(this.newUser);
  user = this.userB.asObservable();

  constructor(
    private oktaAuth: OktaAuthService,
    private idle: Idle,
    private keepalive: Keepalive,
    private dialogService: ConfirmDialogService,
    private store: PersistService,
    private admin: AdminService
  ) {
    this.setIdle();
  }

  setUser(user: UserClaim): void {
    this.userB.next(user);
    this.store.set<UserClaim>('user', user);
  }

  setUserFromStore(user: UserClaim): void {
    this.userB.next(user);
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  private setIdle(): void {
    this.idle.setIdle(this.idleTime);
    this.idle.setTimeout(this.timeOutTime);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer this.idle.';
      this.logIdleState();
    });

    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.logIdleState();
      this.endAndLogout();
    });

    this.idle.onIdleStart.subscribe(() => {
      this.idleState = "You've gone idle!";
      this.logIdleState();

      const dialogOptions = {
        title: "You've gone idle!",
        message: 'Your session will expire in',
        cancelText: 'Log out',
        confirmText: 'Continue',
        timer: this.timeOutTime,
      };
      this.dialogService.open(dialogOptions);
      this.dialogService.confirmed().subscribe((result) => {
        if (result === false) {
          this.endAndLogout();
        }
      });
    });

    this.idle.onTimeoutWarning.subscribe((countdown: any) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
      this.logIdleState();
    });

    this.keepalive.interval(this.keepaliveIntervalTime);

    this.keepalive.onPing.subscribe(() => {
      this.lastPing = new Date();
    });
  }

  logIdleState(): void {}

  async start() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
    this.logIdleState();
    const agentId = this.store.get<string>('agentId') ?? '';
    if (agentId === undefined || agentId === null || agentId === '' || agentId === ' ') {
      const userClaim = await this.admin.getUserClaimAsync();
      this.store.set<UserClaim>('user', userClaim);
      this.userB.next(userClaim);
      this.store.set<any>('user', userClaim);
    } else {
      const userClaim = await this.admin.getUserClaimForAgentAsync(agentId);
      this.store.set<UserClaim>('user', userClaim);
      this.userB.next(userClaim);
      this.store.set<any>('user', userClaim);
    }
  }

  async endAndLogout() {
    this.userB.next(null);
    this.store.remove('user');
    this.idle.stop();
    this.idleState = 'Stop.';
    this.logIdleState();
    this.oktaAuth.logout('');
  }
}
