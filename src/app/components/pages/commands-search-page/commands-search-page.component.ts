import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CommandList } from '@models/commands';
import { UserClaim } from '@models/UserClaim';
import { CommandsService } from '@services/commands.service';
import { ConfirmDialogService } from '@services/confirmDialog.service';
import { FormCheckingService } from '@services/form.check.service';
import { NotificationService } from '@services/notification.service';
import { PersistService } from '@services/persist.service';
import { SessionStorageService } from '@services/storageSession.service';

@Component({
  selector: 'vt-commands-search-page',
  templateUrl: './commands-search-page.component.html',
  styleUrls: ['./commands-search-page.component.scss'],
})
export class CommandsSearchPageComponent implements OnInit {
  public overlay = false;
  public isNotActive = true;
  selectedCommand: any;
  selectedRow: any;
  pageTitle: any;
  user: UserClaim;
  navParentClass: boolean;
  searchedCommandListData: any;
  makeCommandformVisible = false;
  columnsToDisplay: string[];
  dataSource: any;
  allAccounts: any;
  noData = false;
  searchErrors = 0;
  savingErrors = 0;
  searchForm: FormGroup;
  editCommandForm: FormGroup;
  submitted = false;
  codeSubmitted = false;
  companyId: string;
  commandSearchChanges: number;
  editChangecounter: number;
  isSaveable = false;
  isCodeSaveable = false;
  customerMessageItems: any;
  editedCommand: any;

  constructor(
    private activatedroute: ActivatedRoute,
    private notify: NotificationService,
    private commands: CommandsService,
    private fb: FormBuilder,
    private dialogService: ConfirmDialogService,
    private store: PersistService,
    public sessionService: SessionStorageService,
    public formService: FormCheckingService,
    public changeDetectorRef: ChangeDetectorRef
  ) {
    this.activatedroute.data.subscribe((data) => {
      this.pageTitle = data.pageTitle;
      this.user = this.store.get<UserClaim>('user');
    });
  }

  ngOnInit(): void {
    this.companyId = this.user.CompanyId;
    this.searchErrors = 0;
    this.searchForm = this.fb.group(
      {
        searchCommandName: ['', [Validators.required, , Validators.minLength(3)]],
      },
      { updateOn: 'blur' }
    );
    this.editCommandForm = this.fb.group(
      {
        editCommandName: ['', [Validators.required, , Validators.minLength(3)]],
        editCommandDescription: ['', [Validators.required, , Validators.minLength(10)]],
        editCommandMessage: ['', [Validators.required, , Validators.minLength(10)]],
        editCommandCode: ['', [Validators.required, , Validators.minLength(3)]],
      },
      { updateOn: 'blur' }
    );
  }

  get name() {
    return this.searchForm.get('searchCommandName');
  }

  changeDetected(e) {
    const changes: number = this.formService.fieldChangeDetection(e);
    this.sessionService.setVariableToStorage('commandSearchChanges', changes);
    this.commandSearchChanges = +this.sessionService.getVariableFromStorage('commandSearchChanges');
    const input = document.getElementById('searchCommandName');
    if (input.classList.contains('ng-touched')) {
      this.isSaveable = true;
    } else {
      this.isSaveable = false;
    }
  }

  codeChangeDetected(e) {
    const changes: number = this.formService.fieldChangeDetection(e);
    this.sessionService.setVariableToStorage('commandEditChanges', changes);
    this.editChangecounter = +this.sessionService.getVariableFromStorage('commandEditChanges');
    if (this.editChangecounter > 0) {
      this.isCodeSaveable = true;
    } else {
      this.isCodeSaveable = false;
    }
  }

  get codeName() {
    return this.editCommandForm.get('editCommandName');
  }

  get description() {
    return this.editCommandForm.get('editCommandDescription');
  }

  get message() {
    return this.editCommandForm.get('editCommandMessage');
  }

  get code() {
    return this.editCommandForm.get('editCommandCode');
  }

  formSubmit() {
    let formValues;
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.searchErrors++;
      return;
    } else {
      formValues = this.searchForm.getRawValue();
    }

    const commandName: string = formValues.searchCommandName;
    this.commands.findCommandInList(commandName, this.companyId).subscribe(
      (result) => {
        this.noData = false;
        this.searchedCommandListData = result;
        this.columnsToDisplay = ['CommandName', 'CommandListName', 'ConsumerCommand', 'Actions'];
        this.dataSource = new MatTableDataSource<CommandList>(this.searchedCommandListData);
      },
      (error) => {
        this.noData = true;
        this.notify.openSnackBar(error.error.title);
      }
    );
  }

  finalize(): void {
    this.commandSearchChanges = 0;
    this.sessionService.setVariableToStorage('commandSearchChanges', null);
    this.formClear();
  }

  finalizeEdit(): void {
    this.editChangecounter = 0;
    this.sessionService.setVariableToStorage('commandEditChanges', null);
    this.onCloseClicked();
    this.formClear();
  }

  formClear(): void {
    this.submitted = false;
    this.codeSubmitted = false;
    this.searchErrors = 0;
    this.savingErrors = 0;
    this.searchForm.reset();
    this.isSaveable = false;
    this.isCodeSaveable = false;
  }

  showCommandEdit(command: any | boolean) {
    if (!command) {
      this.sessionService.setVariableToStorage('selectedCommand', null);
      this.toggleOverlay();
    } else {
      this.selectedRow = command;
      this.sessionService.setVariableToStorage('selectedCommand', command.CommandId);
      this.editCommandForm.patchValue({
        editCommandName: this.selectedRow.CommandName,
        editCommandDescription: this.selectedRow.CommandDescription,
        editCommandMessage: this.selectedRow.MessageToConsumer,
        editCommandCode: this.selectedRow.ConsumerCommand,
      });
      this.sessionService.setVariableToStorage('commandEditChanges', this.editChangecounter);
      this.commands.getCommandWords().subscribe(
        (result) => {
          this.customerMessageItems = result;
        },
        (error) => {
          this.notify.openSnackBar(error.error.title);
        }
      );
      this.toggleOverlay();
    }
  }

  submitChanges() {
    let formValues;
    this.codeSubmitted = true;
    if (this.editCommandForm.invalid) {
      this.savingErrors++;
      return;
    } else {
      formValues = this.editCommandForm.getRawValue();
    }

    const commandId: number = this.selectedRow.CommandId;
    const commandName: string = formValues.editCommandName;
    const commandDescription: string = formValues.editCommandDescription;
    const messageToConsumer: string = formValues.editCommandMessage;
    const consumerCommand: string = formValues.editCommandCode;
    const commandListId: number = this.selectedRow.CommandListId;
    this.editedCommand = {
      CommandId: commandId,
      CommandName: commandName,
      CommandDescription: commandDescription,
      MessageToConsumer: messageToConsumer,
      ConsumerCommand: consumerCommand,
      CommandListId: commandListId,
    };

    this.commands.updateCommandInList(this.editedCommand).subscribe(
      async (result) => {
        if (result.ErrorMessage) {
          this.notify.openSnackBar(result.ErrorMessage);
        } else {
          this.finalizeEdit();
          this.notify.openSnackBar('The modifications have been saved');
        }
      },
      (error) => {
        this.notify.openSnackBar(error.error.title);
      }
    );
  }

  toggleOverlay(): void {
    const overlayContainer = document.querySelector('#command-overlay');
    const overlayBg = document.querySelector('.dark-overlay');
    const body = document.querySelector('body');
    overlayContainer.classList.toggle('active');
    overlayBg.classList.toggle('active');
    body.classList.toggle('active');
    this.overlay = !this.overlay;
    this.makeCommandformVisible = true;
    if (this.overlay === true) {
      this.onOverlayClicked();
    }
  }

  toggleReceive($event) {
    this.navParentClass = $event;
  }

  onOverlayClicked() {
    const overlay = document.querySelector('.dark-overlay') as HTMLElement;
    overlay.addEventListener('click', this.handleDialog);
  }

  onCloseClicked() {
    const changedCommandVariables: number = +this.sessionService.getVariableFromStorage('commandEditChanges');
    if (changedCommandVariables > 0) {
      this.openConfirmDialog();
    } else {
      this.toggleOverlay();
      this.selectedRow = '';
      this.sessionService.setVariableToStorage('selectedCommand', null);
      this.makeCommandformVisible = false;
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
        this.selectedRow = '';
        this.sessionService.setVariableToStorage('selectedCommand', null);
        this.makeCommandformVisible = false;
      }
    });
  }

  handleDialog() {
    const overlay = document.querySelector('.dark-overlay') as HTMLElement;
    if (overlay === event.target) {
      const closeBtn: HTMLElement = document.getElementsByClassName('sidebar-close')[0] as HTMLElement;
      closeBtn.click();
    }
    if (this.selectedRow === '') document.removeEventListener('click', this.handleDialog);
  }
}
