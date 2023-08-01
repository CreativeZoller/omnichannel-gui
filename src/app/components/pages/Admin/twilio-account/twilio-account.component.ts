import { Component, OnInit, ViewChild } from '@angular/core';
import { ITwilioAccount } from '@models/twilioAccount';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { AdminService } from '@services/admin.services';
import { NotificationService } from '@services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ITwilioAccountRequest } from '../../../../models/twilioAccountRequest';
import { IBaseResult } from '../../../../models/baseResult';
import { UserClaim } from '@models/UserClaim';
import { LocalSessionService } from '@services/localSession.service';
import { PersistService } from '@services/persist.service';

@Component({
  selector: 'vt-twilio-account',
  templateUrl: './twilio-account.component.html',
  styleUrls: ['./twilio-account.component.scss'],
})
export class TwilioAccountComponent implements OnInit {
  twilioForm: FormGroup;
  default = new FormControl();
  active = new FormControl();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[];
  dataSource: any;
  accounts: ITwilioAccount[];
  pageTitle = 'Twilio Accounts';
  isNew = false;
  selected: ITwilioAccount;
  overlay = false;
  user: UserClaim;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private store: PersistService,
    private localSessionService: LocalSessionService,
    private adminService: AdminService,
    private notify: NotificationService
  ) {
    this.activatedRoute.data.subscribe((data) => {
      this.accounts = data.twilioAccounts;
    });
    this.user = this.store.get<UserClaim>('user');
    this.localSessionService.setUserFromStore(this.user);
  }

  ngOnInit(): void {
    this.setDataSource();
    this.twilioForm = this.formBuilder.group({
      accountSid: [{ value: '', disabled: false }, Validators.compose([Validators.required, Validators.maxLength(128)])],
      token: [{ value: '', disabled: false }, Validators.compose([Validators.required, Validators.maxLength(256)])],
      phoneNumber: [{ value: '', disabled: false }, Validators.compose([Validators.required, Validators.maxLength(16)])],
      url: [{ value: '', disabled: false }, Validators.compose([Validators.required, Validators.maxLength(128)])],
    });

    this.default.setValue(false);
    this.active.setValue(false);
  }

  get f() {
    return this.twilioForm.controls;
  }

  canShowError(control: AbstractControl): boolean {
    return (control.dirty || control.touched) && control.invalid;
  }

  displaySettings(setting?: any): string {
    if (setting === null || setting === undefined) {
      return undefined;
    }
    if (setting.Name !== undefined) {
      return setting.Name;
    }
    return setting;
  }

  create() {
    this.reset();
    this.isNew = true;
    this.twilioForm.markAsUntouched();
    this.overlay = !this.overlay;
  }

  edit(item: ITwilioAccount) {
    this.twilioForm.controls['accountSid'].setValue(item.AccountSid);
    this.twilioForm.controls['token'].setValue(item.TwilioToken);
    this.twilioForm.controls['phoneNumber'].setValue(item.PhoneNumber);
    this.twilioForm.controls['url'].setValue(item.WebHookUrl);
    this.default.setValue(item.Default);
    this.active.setValue(item.IsActive);
    this.isNew = false;
    this.selected = item;
    this.twilioForm.controls['accountSid'].markAsUntouched();
    this.twilioForm.controls['token'].markAsUntouched();
    this.twilioForm.controls['phoneNumber'].markAsUntouched();
    this.twilioForm.controls['url'].markAsUntouched();
    this.overlay = !this.overlay;
  }

  onCancel() {
    this.reset();
    this.overlay = !this.overlay;
  }

  onSubmit() {
    if (this.twilioForm.invalid) {
      this.twilioForm.markAllAsTouched();
      return;
    }

    const model: ITwilioAccountRequest = {
      AccountSid: this.twilioForm.controls['accountSid'].value,
      TwilioToken: this.twilioForm.controls['token'].value,
      PhoneNumber: this.twilioForm.controls['phoneNumber'].value,
      Default: this.default.value,
      IsActive: this.active.value,
      WebHookUrl: this.twilioForm.controls['url'].value,
    };

    if (this.isNew) {
      this.adminService.createTwilioAccount(this.user.CompanyId, model).subscribe(
        (result: ITwilioAccount) => {
          if (result.ErrorMessage === null || result.ErrorMessage === undefined || result.ErrorMessage === '') {
            this.refresh();
          }
        },
        (error) => {
          this.notify.openSnackBarError(error);
        }
      );
    } else {
      this.adminService.updateTwilioAccount(this.user.CompanyId, model).subscribe(
        (result: IBaseResult<boolean>) => {
          if (result.ErrorMessage === null || result.ErrorMessage === undefined || result.ErrorMessage === '') {
            this.refresh();
          }
        },
        (error) => {
          this.notify.openSnackBarError(error);
        }
      );
    }

    this.reset();
    this.overlay = !this.overlay;
  }

  private reset() {
    this.twilioForm.controls['accountSid'].setValue('');
    this.twilioForm.controls['token'].setValue('');
    this.twilioForm.controls['phoneNumber'].setValue('');
    this.twilioForm.controls['url'].setValue('');
    this.default.setValue(false);
    this.active.setValue(false);
    this.isNew = false;
    this.twilioForm.controls['accountSid'].markAsUntouched();
    this.twilioForm.controls['token'].markAsUntouched();
    this.twilioForm.controls['phoneNumber'].markAsUntouched();
    this.twilioForm.controls['url'].markAsUntouched();
  }

  private refresh() {
    let messageErrors = 0;
    this.adminService.getTwilioAccounts(this.user.CompanyId).subscribe(
      (result) => {
        result.forEach((value) => {
          if (value.ErrorMessage === null || value.ErrorMessage === undefined || value.ErrorMessage === '') {
            return;
          }
          messageErrors++;
        });
        if (messageErrors === 0) {
          this.accounts = result;
          this.setDataSource();
        }
      },
      (error) => {
        messageErrors++;
        this.notify.openSnackBar(error);
      }
    );
  }

  delete(item: ITwilioAccount) {
    this.adminService.deleteTwilioAccount(this.user.CompanyId, item.AccountSid).subscribe(
      (result: IBaseResult<boolean>) => {
        if (result.ErrorMessage === null || result.ErrorMessage === undefined || result.ErrorMessage === '') {
          this.refresh();
        }
      },
      (error) => {
        this.notify.openSnackBarError(error);
      }
    );
  }

  private setDataSource() {
    this.displayedColumns = [
      'AccountSid',
      'TwilioToken',
      'WebHookUrl',
      'PhoneNumber',
      'Default',
      'IsActive',
      'CreatedBy',
      'Created',
      'ModifiedBy',
      'Modified',
      'Actions',
    ];
    this.dataSource = new MatTableDataSource<ITwilioAccount>(this.accounts);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.paginator) {
      this.paginator.pageSize = 10;
      this.dataSource.paginator.firstPage();
    }
  }
}
