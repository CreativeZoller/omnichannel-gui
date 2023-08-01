import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { manageableUser, cancellableUser } from '@models/manageableUsers';
import { UserClaim } from '@models/UserClaim';
import { ConfirmDialogService } from '@services/confirmDialog.service';
import { FormCheckingService } from '@services/form.check.service';
import { ManageUsersService } from '@services/manageUsers.service';
import { NotificationService } from '@services/notification.service';
import { PersistService } from '@services/persist.service';
import { SessionStorageService } from '@services/storageSession.service';

@Component({
  selector: 'vt-manage-users-page',
  templateUrl: './manage-users-page.component.html',
  styleUrls: ['./manage-users-page.component.scss']
})
export class ManageUsersPageComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  pageTitle: any;
  user: UserClaim;
  navParentClass: boolean;
  overlay = false;
  usersToManage: manageableUser[];
  columnsToDisplay: string[];
  dataSource: any;
  selectedRow: any;
  makeListformVisible = false;
  userIsBlocked: boolean = false;
  userIsOptOut: boolean = false;
  userCanUnlock: boolean = false;
  userCanReset: boolean = false;
  isUnblockable: boolean = false;
  isOptable: boolean = false;
  useCase: string;
  useCaseText: string;

  constructor(
    private activatedroute: ActivatedRoute,
    private notify: NotificationService,
    private users: ManageUsersService,
    private dialogService: ConfirmDialogService,
    private store: PersistService,
    public formService: FormCheckingService,
    public sessionService: SessionStorageService,
    public changeDetectorRef: ChangeDetectorRef
  ) {
    this.activatedroute.data.subscribe((data) => {
      this.pageTitle = data.pageTitle;
      this.user = this.store.get<UserClaim>('user');
      this.usersToManage = data.userData;
      this.columnsToDisplay = ['AccountNumber', 'DebtorName', 'PhoneNumber', 'Actions'];
      this.dataSource = new MatTableDataSource<manageableUser>(this.usersToManage);
    });
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.userCanUnlock = this.user?.Claims?.indexOf('OmniChannel.ManageUsers.Unlock') > -1 ?? false;
    this.userCanReset = this.user?.Claims?.indexOf('OmniChannel.ManageUsers.OptOutCancel') > -1 ?? false;
  }

  toggleReceive($event) {
    this.navParentClass = $event;
  }

  // main methods
  toggleOverlay(): void {
    const overlayContainer = document.querySelector('#users-overlay');
    const overlayBg = document.querySelector('.dark-overlay');
    const body = document.querySelector('body');
    overlayContainer.classList.toggle('active');
    overlayBg.classList.toggle('active');
    body.classList.toggle('active');
    this.overlay = !this.overlay;
    this.makeListformVisible = true;
    if (this.overlay === true) {
      this.onOverlayClicked();
    }
  }

  onOverlayClicked() {
    const overlay = document.querySelector('.dark-overlay') as HTMLElement;
    overlay.addEventListener('click', this.handleDialog);
  }

  handleDialog() {
    const overlay = document.querySelector('.dark-overlay') as HTMLElement;
    if (overlay === event.target) {
      const closeBtn: HTMLElement = document.getElementsByClassName('sidebar-close')[0] as HTMLElement;
      closeBtn.click();
    }
    if (this.selectedRow === '') document.removeEventListener('click', this.handleDialog);
  }

  forceRefresh(info: any) {
    this.onCloseClicked();
    setTimeout(() => {
      this.refreshUserList();
    }, 100);
  }

  refreshUserList() {
    this.users.getAllUsersByCompany(this.user.CompanyId).subscribe(
      (result) => {
        this.usersToManage = result;
        this.dataSource = new MatTableDataSource<manageableUser>(this.usersToManage);
        this.changeDetectorRef.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onCloseClicked() {
    const changedVariables: number = +this.sessionService.getVariableFromStorage('selectedUserChanges');

    if (changedVariables != 0) {
      this.openConfirmDialog();
    } else {
      this.toggleOverlay();
      this.selectedRow = null;
      this.sessionService.setVariableToStorage('selectedUser', null);
      this.sessionService.setVariableToStorage('selectedUserChanges', null);
      this.makeListformVisible = false;
    }
  }

  openConfirmDialog() {
    const dialogOptions = {
      title: 'Are You sure?',
      message: 'There may be unsaved modifications. If you proceed now, they will be lost. To hold those changes, please save first.',
      cancelText: 'Cancel',
      confirmText: 'Proceed',
    };
    this.dialogService.open(dialogOptions);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.toggleOverlay();
        this.selectedRow = null;
        this.sessionService.setVariableToStorage('selectedUser', null);
        this.sessionService.setVariableToStorage('selectedUserChanges', null);
        this.makeListformVisible = false;
      }
    });
  }

  unlockUser(user: any | boolean) {
    if (user) {
      this.selectedRow = user;
      this.useCase = 'unlock';
      this.useCaseText = 'Unlocking account';
      this.toggleOverlay();
    } else {
      this.sessionService.setVariableToStorage('selectedUser', null);
      this.selectedRow = null;
      this.toggleOverlay();
    }
  }

  antiOptoutUser(user: any | boolean) {
    if (user) {
      this.selectedRow = user;
      this.useCase = 'optout';
      this.useCaseText = 'Resetting account';
      this.toggleOverlay();
    } else {
      this.sessionService.setVariableToStorage('selectedUser', null);
      this.selectedRow = null;
      this.toggleOverlay();
    }
  }

}
