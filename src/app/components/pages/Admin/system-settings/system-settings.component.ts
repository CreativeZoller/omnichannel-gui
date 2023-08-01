import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '@services/admin.services';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, FormGroupDirective } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ISettings } from '../../../../models/settings';
import { ISelectItem } from '../../../../models/selectItem';
import { NotificationService } from '../../../../services/notification.service';
import { IBaseResult } from '../../../../models/baseResult';
import { UserClaim } from '@models/UserClaim';
import { PersistService } from '@services/persist.service';
import { LocalSessionService } from '@services/localSession.service';
import { DOCUMENT } from '@angular/common';
import { ConfirmDialogService } from '@services/confirmDialog.service';
import { CommunicationTemplatesComponentResolverService } from '@pages/communication-templates-page/communication-templates-page-resolver.service';

@Component({
  selector: 'vt-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss'],
})
export class SystemSettingsComponent implements OnInit {
  settingsForm: FormGroup;
  settingsControl = new FormControl();
  filteredSettingsOptions: Observable<ISelectItem<number>[]>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[];
  dataSource: any;
  settings: ISettings[];
  names: ISelectItem<number>[];
  pageTitle = 'System settings';
  showEdit = false;
  isNew = false;
  selectedId: number;
  overlay = false;
  showWarning = false;
  user: UserClaim;
  showInput = false;
  inputGeneration: string;
  inputGenerationHint: string;
  inputGenerationError: string;
  minDate: any;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private store: PersistService,
    private localSessionService: LocalSessionService,
    private dialogService: ConfirmDialogService,
    private notify: NotificationService,
    public changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.activatedRoute.data.subscribe((data) => {
      this.settings = data.settings;
      this.names = data.names;
      this.names.push({ Name: '', Value: -1, ErrorMessage: '' });
      this.names = this.getUsableSettings();
    });
    this.user = this.store.get<UserClaim>('user');
    this.localSessionService.setUserFromStore(this.user);
  }

  ngOnInit(): void {
    this.setDataSource();
    this.settingsForm = this.formBuilder.group({
      value: [{ value: '', disabled: false }, Validators.compose([Validators.required])],
    });

    this.settingsForm.get('value').valueChanges.subscribe((_) => {
      this.showWarning = this.settingsControl.value.Value === 13 && _.indexOf('STOP') === -1;
    });

    this.filteredSettingsOptions = this.settingsControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterSettings(value))
    );

    this.settingsControl.setValue(this.names[0]);
    this.minDate = new Date().toISOString().substring(0, 16);
  }

  getUsableSettings() {
    let usedOptions = [];
    this.settings.forEach((setting) => {
      usedOptions.push(setting.SettingTypeName);
    });
    const usableOptions = this.names.filter((i) => !usedOptions.includes(i.Name));
    return usableOptions;
  }

  get f() {
    return this.settingsForm.controls;
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
    this.settingsControl.setValue({ Name: '', Value: -1, ErrorMessage: '' });
    this.settingsForm.controls['value'].setValue('');
    this.isNew = true;
    this.settingsControl.markAsUntouched();
    this.settingsForm.markAsUntouched();
    this.overlay = !this.overlay;
  }

  edit(item: ISettings) {
    this.settingsControl.setValue({ Name: item.SettingTypeName, Value: item.SettingTypeValue, ErrorMessage: '' });
    this.settingsForm.controls['value'].setValue(item.Value);
    this.isNew = false;
    this.selectedId = item.SystemSettingId;
    this.settingsControl.markAsUntouched();
    this.settingsForm.markAsUntouched();
    this.overlay = !this.overlay;
  }

  onCancel() {
    this.reset();
    this.overlay = !this.overlay;
  }

  onSubmit() {
    if (
      this.settingsForm.invalid ||
      this.settingsControl.invalid ||
      this.settingsControl.value.Value === undefined ||
      this.settingsControl.value.Value < 0
    ) {
      this.settingsControl.markAsTouched();
      this.settingsForm.markAllAsTouched();
      return;
    }

    if (this.settingsForm.controls['value'].value != null) {
      if (this.settingsForm.controls['value'].value.length < 3) {
        this.notify.openSnackBar('Please enter at least 3 characters');
        return;
      }
    }

    if (this.isNew) {
      this.adminService
        .createSetting(this.user.CompanyId, this.settingsControl.value.Value, this.settingsForm.controls['value'].value)
        .subscribe(
          (result: ISettings) => {
            if (result.ErrorMessage === null || result.ErrorMessage === undefined || result.ErrorMessage === '') {
              this.refresh();
            }
          },
          (error) => {
            this.notify.openSnackBarError(error);
          }
        );
    } else {
      this.adminService
        .updateSetting(this.user.CompanyId, this.selectedId, this.settingsControl.value.Value, this.settingsForm.controls['value'].value)
        .subscribe(
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
    this.settingsControl.setValue({ Name: '', Value: -1, ErrorMessage: '' });
    this.settingsForm.controls['value'].setValue('');
    this.isNew = false;
    this.settingsControl.markAsUntouched();
    this.settingsForm.markAsUntouched();
    this.settingsForm.reset();
    Object.keys(this.settingsForm.controls).forEach((key) => {
      this.settingsForm.get(key).setErrors(null);
    });
    this.showInput = false;
  }

  private refresh() {
    let messageErrors = 0;
    this.adminService.getSettings(this.user.CompanyId).subscribe(
      (result) => {
        result.forEach((value) => {
          if (value.ErrorMessage === null || value.ErrorMessage === undefined || value.ErrorMessage === '') {
            return;
          }
          messageErrors++;
        });
        if (messageErrors === 0) {
          this.settings = result;
          this.setDataSource();
          this.changeDetectorRef.detectChanges();
          setTimeout(() => {
            this.document.location.reload();
          }, 5000);
        }
      },
      (error) => {
        messageErrors++;
        this.notify.openSnackBar(error);
      }
    );
  }

  public delete(item: ISettings) {
    const dialogOptions = {
      title: 'Are You sure?',
      message: 'The selected item will be removed if you choose to proceed.',
      cancelText: 'Cancel',
      confirmText: 'Proceed',
    };
    this.dialogService.open(dialogOptions);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.adminService.deleteSetting(this.user.CompanyId, item.SystemSettingId).subscribe(
          (result: IBaseResult<boolean>) => {
            if (result.ErrorMessage === null || result.ErrorMessage === undefined || result.ErrorMessage === '') {
              this.notify.openSnackBar('The selected setting has been deleted');
              setTimeout(() => {
                this.refresh();
              }, 500);
            }
          },
          (error) => {
            this.notify.openSnackBarError(error);
          }
        );
      }
    });
  }

  public changeInput(option: any) {
    this.showInput = true;
    switch (option.Name) {
      case 'OutGoingFreezeWindowStart':
        this.inputGeneration = 'datetime';
        this.inputGenerationHint = 'Messages will not be sent from the system starting at this time daily.';
        break;
      case 'OutGoingFreezeWindowStop':
        this.inputGeneration = 'datetime';
        this.inputGenerationHint = 'Messages will not be sent from the system between OutGoingFreezeWindowStart and this time daily.';
        break;
      case 'MainSessionExpire':
        this.inputGeneration = 'number';
        this.inputGenerationHint = 'Consumers must restart their chat session after this number of days of inactivity.';
        break;
      case 'ConsentSessionExpire':
        this.inputGeneration = 'number';
        this.inputGenerationHint = 'Consumers will be required to re-consent after this number of days.';
        break;
      case 'DemandLetterConfiguration':
        this.inputGeneration = 'text';
        this.inputGenerationHint =
          'The system will not send messages to a consumer until this number of days have passed since a Demand Letter was sent.';
        break;
      case 'InvalidMasterKeyMessage':
        this.inputGeneration = 'text';
        this.inputGenerationHint = 'Message to consumer in case they send the wrong code to initiate their session.';
        break;
      case 'InvalidCommandMessage':
        this.inputGeneration = 'text';
        this.inputGenerationHint = 'Message to consumer in case the consumer sends an unrecognized command.';
        break;
      case 'EmptyMessage':
        this.inputGeneration = 'text';
        this.inputGenerationHint = 'Message back to consumer in case they send an empty message.';
        break;
      case 'AccountNumberRequestMessage':
        this.inputGeneration = 'text';
        this.inputGenerationHint = 'Message to consumer to ask Master Key.';
        break;
      case 'DataNotFound':
        this.inputGeneration = 'text';
        this.inputGenerationHint = 'Message to consumer when the account or the consumer is not identifiable based on the data available.';
        break;
      case 'DisclosureMessage':
        this.inputGeneration = 'text';
        this.inputGenerationHint = 'Disclosure language that is sent to the consumer after they successfully pass the security validation.';
        break;
      case 'ConsentAskingMessage':
        this.inputGeneration = 'text';
        this.inputGenerationHint = 'Message to consumer to ask for consent to receive messages from the system.';
        break;
      case 'ConsentProvidingMessage':
        this.inputGeneration = 'text';
        this.inputGenerationHint =
          'Consumer must send this exact message to consent in response to the ConsentAskingMessage (e.g. “I consent”).';
        break;
      default:
        this.inputGeneration = 'text';
        this.inputGenerationHint = '';
        break;
    }
    if (this.inputGeneration == 'text') {
      this.inputGenerationError = 'Please enter a proper text which is longer than 3 characters.';
      // max 128 chars
    } else if (this.inputGeneration == 'number') {
      this.inputGenerationError = 'Please enter only positive, integer numbers.';
    } else if (this.inputGeneration == 'datetime') {
      this.inputGenerationError = 'Please enter a proper date which is not in the past';
    }
  }

  private _filterSettings(value: any): ISelectItem<number>[] {
    const filterValue = value.Name !== undefined ? value.Name.toLowerCase() : value.toLowerCase();

    return this.names.filter((_) => _.Name.toLowerCase().includes(filterValue));
  }

  private setDataSource() {
    this.displayedColumns = ['SettingTypeName', 'Value', 'CreatedBy', 'Created', 'ModifiedBy', 'Modified', 'Actions'];
    this.dataSource = new MatTableDataSource<ISettings>(this.settings);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.paginator) {
      this.paginator.pageSize = 10;
      this.dataSource.paginator.firstPage();
    }
  }
}
