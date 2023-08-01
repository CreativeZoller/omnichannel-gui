import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@services/notification.service';
import { CommandsService } from '@services/commands.service';
import { UpdatingCommandList } from '@models/commands';
import { SessionStorageService } from '@services/storageSession.service';
import { FormCheckingService } from '@services/form.check.service';
import { PersistService } from '@services/persist.service';
import { UserClaim } from '@models/UserClaim';

@Component({
  selector: 'vt-edit-commandlist-form',
  templateUrl: './edit-commandslist-form.component.html',
})
export class EditCommandlistFormComponent implements OnInit {
  @Input() commandsList;
  @Input() isListformVisible;
  @Output() commandsListAdded = new EventEmitter();
  @ViewChild("editListDefault") editListDefault;
  isNotActive = true;
  listIsActive = false;
  listIsDefault = false;
  editListForm: FormGroup;
  submitted = false;
  savingErrors = 0;
  editedList: UpdatingCommandList;
  editChangecounter: number;
  isSaveable = false;
  user: UserClaim;
  companyId = 0;
  changes: number = 0;

  constructor(
    private notify: NotificationService,
    private commands: CommandsService,
    private fb: FormBuilder,
    public sessionService: SessionStorageService,
    public formService: FormCheckingService,
    private store: PersistService,
  ) {
    this.user = this.store.get<UserClaim>('user');
    this.companyId = +this.user.CompanyId;
  }

  ngOnInit() {
    this.editListForm = this.fb.group(
      {
        editListName: ['', [Validators.required, , Validators.minLength(4)]],
        editListDescription: ['', [Validators.required, , Validators.minLength(10)]],
      },
      { updateOn: 'change' }
    );
    if (this.commandsList) {
      this.editListForm.patchValue({
        editListName: this.commandsList.CommandListName,
        editListDescription: this.commandsList.CommandListDescription,
      });
      if (this.commandsList.IsDefault === true) this.listIsDefault = true;
    }
    this.sessionService.setVariableToStorage('commandsListEditChanges', this.editChangecounter);

  }

  get name() {
    return this.editListForm.get('editListName');
  }

  get description() {
    return this.editListForm.get('editListDescription');
  }

  changeDetected(e) {
    this.changes = this.formService.fieldChangeDetection(e);
    this.sessionService.setVariableToStorage('commandsListEditChanges', this.changes);
    this.editChangecounter = +this.sessionService.getVariableFromStorage('commandsListEditChanges');
    if (this.editChangecounter == 0) {
      this.isSaveable = false;
    } else {
      this.isSaveable = true;
    }
  }

  formSubmit() {
    let formValues;
    this.submitted = true;
    if (this.editListForm.invalid) {
      this.savingErrors++;
      return;
    } else {
      formValues = this.editListForm.getRawValue();
    }

    const listName: string = formValues.editListName;
    const listDescription: string = formValues.editListDescription;
    const companyId: number = +this.user.CompanyId;
    const editListDefault = this.editListDefault.nativeElement.checked;

    if (this.commandsList) {
      const editingCommandsListId: number = +sessionStorage.getItem('selectedCommandsList');
      this.editedList = {
        CommandListId: editingCommandsListId,
        CommandListName: listName,
        CommandListDescription: listDescription,
        CompanyId: companyId,
        IsDefault: editListDefault,
        IsActive: true,
      };
    } else {
      this.editedList = {
        CommandListId: 0,
        CommandListName: listName,
        CommandListDescription: listDescription,
        CompanyId: companyId,
        IsDefault: editListDefault,
        IsActive: true,
      };
    }

    if (this.commandsList) {
      this.commands.updateCommandsList(this.editedList).subscribe(
        async (result) => {
          this.finalize();
          this.notify.openSnackBar('The modifications have been saved');
        },
        (error) => {
          this.notify.openSnackBar(error.error.title);
        }
      );
    } else {
      this.commands.addCommandsList(this.editedList).subscribe(
        async (result) => {
          this.finalize();
          this.notify.openSnackBar('The commands list has been saved');
        },
        (error) => {
          this.notify.openSnackBar(error.error.title);
        }
      );
    }
  }

  finalize(): void {
    this.editChangecounter = 0;
    this.sessionService.setVariableToStorage('commandsListEditChanges', null);
    this.commandsListAdded.emit(true);
    this.formClear();
  }

  formClear(): void {
    this.submitted = false;
    this.savingErrors = 0;
    this.editListForm.reset();

    this.isSaveable = false;
  }
}
