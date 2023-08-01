import { Component, OnInit, Input, EventEmitter, Output, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@services/notification.service';
import { CommandsService } from '@services/commands.service';
import { SessionStorageService } from '@services/storageSession.service';
import { FormCheckingService } from '@services/form.check.service';

@Component({
  selector: 'vt-edit-command-form',
  templateUrl: './edit-command-form.component.html',
})
export class EditCommandFormComponent implements OnInit, AfterViewChecked {
  @Input() command;
  @Input() isCommandformVisible;
  @Output() commandAdded = new EventEmitter();
  editCommandForm: FormGroup;
  submitted = false;
  savingErrors = 0;
  editedCommand: any;
  customerMessageItems: any;
  editChangecounter: number;
  isSaveable = false;

  constructor(
    private notify: NotificationService,
    private commands: CommandsService,
    private fb: FormBuilder,
    public sessionService: SessionStorageService,
    public formService: FormCheckingService
  ) {}

  ngOnInit(): void {
    this.editCommandForm = this.fb.group(
      {
        editCommandName: ['', [Validators.required, , Validators.minLength(3)]],
        editCommandDescription: ['', [Validators.required, , Validators.minLength(10)]],
        editCommandMessage: ['', [Validators.required, , Validators.minLength(10)]],
        editCommandCode: ['', [Validators.required, , Validators.minLength(3)]],
      },
      { updateOn: 'change' }
    );
    if (this.command) {
      this.editCommandForm.patchValue({
        editCommandName: this.command.CommandName,
        editCommandDescription: this.command.CommandDescription,
        editCommandMessage: this.command.MessageToConsumer,
        editCommandCode: this.command.ConsumerCommand,
      });
    }
    this.sessionService.setVariableToStorage('commandEditChanges', this.editChangecounter);

    this.commands.getCommandWords().subscribe(
      (result) => {
        this.customerMessageItems = result;
      },
      (error) => {
        this.notify.openSnackBar(error.error.title);
      }
    );
  }

  ngAfterViewChecked(): void {
    if (!this.command && this.isCommandformVisible === false) this.formClear();
  }

  changeDetected(e) {
    const changes: number = this.formService.fieldChangeDetection(e);
    this.sessionService.setVariableToStorage('commandEditChanges', changes);
    this.editChangecounter = +this.sessionService.getVariableFromStorage('commandEditChanges');
    if (this.editChangecounter > 0) {
      this.isSaveable = true;
    } else {
      this.isSaveable = false;
    }
  }

  get name() {
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
    if (this.editCommandForm.invalid) {
      this.savingErrors++;
      return;
    } else {
      formValues = this.editCommandForm.getRawValue();
    }

    const commandName: string = formValues.editCommandName;
    const commandDescription: string = formValues.editCommandDescription;
    const messageToConsumer: string = formValues.editCommandMessage;
    const consumerCommand: string = formValues.editCommandCode;
    const commandListId: number = +sessionStorage.getItem('selectedCommandsList');
    if (this.command) {
      const commandId: number = this.command.CommandId;
      this.editedCommand = {
        CommandId: commandId,
        CommandName: commandName,
        CommandDescription: commandDescription,
        MessageToConsumer: messageToConsumer,
        ConsumerCommand: consumerCommand,
        CommandListId: commandListId,
      };
    } else {
      this.editedCommand = {
        CommandId: 0,
        CommandName: commandName,
        CommandDescription: commandDescription,
        MessageToConsumer: messageToConsumer,
        ConsumerCommand: consumerCommand,
        CommandListId: commandListId,
      };
    }

    if (this.command) {
      this.commands.updateCommandInList(this.editedCommand).subscribe(
        async (result) => {
          if (result.ErrorMessage) {
            this.notify.openSnackBar(result.ErrorMessage);
          } else {
            this.finalize();
            this.notify.openSnackBar('The modifications have been saved');
          }
        },
        (error) => {
          this.notify.openSnackBar(error.error.title);
        }
      );
    } else {
      this.commands.addCommandInList(this.editedCommand).subscribe(
        async (result) => {
          if (result.ErrorMessage) {
            this.notify.openSnackBar(result.ErrorMessage);
          } else {
            this.finalize();
            this.notify.openSnackBar('The command has been saved');
          }
        },
        (error) => {
          this.notify.openSnackBar(error.error.title);
        }
      );
    }
  }

  finalize(): void {
    this.editChangecounter = 0;
    this.sessionService.setVariableToStorage('commandEditChanges', null);
    this.commandAdded.emit(true);
    this.formClear();
  }

  formClear(): void {
    this.submitted = false;
    this.savingErrors = 0;
    this.editCommandForm.reset();

    this.isSaveable = false;
  }
}
