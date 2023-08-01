import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { cancellableUser } from '@models/manageableUsers';
import { UserClaim } from '@models/UserClaim';
import { FormCheckingService } from '@services/form.check.service';
import { ManageUsersService } from '@services/manageUsers.service';
import { NotificationService } from '@services/notification.service';
import { PersistService } from '@services/persist.service';
import { SessionStorageService } from '@services/storageSession.service';

@Component({
  selector: 'vt-manage-users-form',
  templateUrl: './manage-users-form.component.html'
})
export class ManageUsersFormComponent implements OnInit {
  @Input() userToManage;
  @Input() action;
  @Input() isListformVisible;
  @Output() userChanged = new EventEmitter();
  managedUser: cancellableUser;
  userManagamentForm: FormGroup;
  editChangeCounter: number = 0;
  changes: number = 0;
  submitted: boolean = false;
  isSaveable: boolean = false;
  user: UserClaim;
  companyId = 0;

  constructor(
    private notify: NotificationService,
    private users: ManageUsersService,
    private fb: FormBuilder,
    public sessionService: SessionStorageService,
    public formService: FormCheckingService,
    private store: PersistService,
  ) {
    this.user = this.store.get<UserClaim>('user');
    this.companyId = +this.user.CompanyId;
  }

  ngOnInit(): void {
    this.userManagamentForm = this.fb.group(
      {
        manageComment: ['', [Validators.required, , Validators.minLength(10)]],
      },
      { updateOn: 'change' }
    );
    this.sessionService.setVariableToStorage('selectedUserChanges', this.editChangeCounter);
  }

  get manageComment() {
    return this.userManagamentForm.get('manageComment');
  }

  changeDetected(e) {
    this.changes = this.formService.fieldChangeDetection(e);
    this.sessionService.setVariableToStorage('selectedUserChanges', this.changes);
    this.editChangeCounter = +this.sessionService.getVariableFromStorage('selectedUserChanges');
    if (this.editChangeCounter == 0) {
      this.isSaveable = false;
    } else {
      this.isSaveable = true;
    }
  }

  formSubmit() {
    let formValues;
    this.submitted = true;
    if (this.userManagamentForm.invalid) {
      return;
    } else {
      formValues = this.userManagamentForm.getRawValue();
    }

    const commentContent: string = formValues.manageComment;
    const commentAccount: string = this.userToManage.AccountNumber;
    const commentPhone: string = this.userToManage.PhoneNumber;
    const commentCompany: number = +this.user.CompanyId;
    this.managedUser = {
      accountNumber: commentAccount,
      comment: commentContent,
      phoneNumber: commentPhone,
      company_id: commentCompany,
    };
    if (this.action == 'unlock') {
      this.users.unlockUser(this.managedUser).subscribe(
        (result) => {
          this.finalize();
          this.notify.openSnackBar('The action was successfull');
        },
        (error) => {
          this.notify.openSnackBar(error.error.title);
        }
      );
    }
    if (this.action == 'optout') {
      this.users.cancelUser(this.managedUser).subscribe(
        (result) => {
          this.finalize();
          this.notify.openSnackBar('The action was successfull');
        },
        (error) => {
          this.notify.openSnackBar(error.error.title);
        }
      );
    }
  }

  finalize() {
    this.editChangeCounter = 0;
    this.sessionService.setVariableToStorage('selectedUserChanges', null);
    this.sessionService.setVariableToStorage('selectedUser', null);
    this.userChanged.emit(true);
    this.formClear();
  }

  formClear(): void {
    this.submitted = false;
    this.userManagamentForm.reset();
    this.isSaveable = false;
  }

}
