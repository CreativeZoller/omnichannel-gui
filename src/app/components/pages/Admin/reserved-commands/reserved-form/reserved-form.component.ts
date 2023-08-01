import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservedCommand } from '@models/commands';
import { UserClaim } from '@models/UserClaim';
import { FormCheckingService } from '@services/form.check.service';
import { NotificationService } from '@services/notification.service';
import { PersistService } from '@services/persist.service';
import { ReservedCommandsService } from '@services/reservedCommands.service';
import { SessionStorageService } from '@services/storageSession.service';

@Component({
  selector: 'vt-reserved-form',
  templateUrl: './reserved-form.component.html'
})
export class ReservedFormComponent implements OnInit {
  @Input() selectedCmd;
  @Input() isCommandformVisible;
  @Input() commandsToBeUsed;
  @Output() cmdAdded = new EventEmitter();
  editCommandForm: FormGroup;
  submitted = false;
  savingErrors = 0;
  cmdTypeArray: any;
  editChangecounter: number;
  isSaveable = false;
  selectedCmdType: any = [];
  editedCommand: ReservedCommand;
  usr: UserClaim;
  isChangeable = true;

  constructor (
    private notify: NotificationService,
    private commands: ReservedCommandsService,
    private fb: FormBuilder,
    private store: PersistService,
    private sessionService: SessionStorageService,
    private formService: FormCheckingService
  ) {
    this.usr = this.store.get<UserClaim>('user');
  }

  ngOnInit(): void {
    this.cmdTypeArray = this.commandsToBeUsed;
    this.editCommandForm = this.fb.group(
      {
        reservedCommandName: ['', [Validators.required, , Validators.minLength(3)]],
        reservedCommandDescription: ['', [Validators.required, , Validators.minLength(10)]],
        messageToConsumer: ['', [Validators.required, , Validators.minLength(10)]],
        cmdType: ['', [Validators.required]],
      },
      { updateOn: 'change' }
    );
    if (this.selectedCmd) {
      this.editCommandForm.patchValue({
        reservedCommandName: this.selectedCmd.ReservedCommandName,
        reservedCommandDescription: this.selectedCmd.ReservedCommandDescription,
        messageToConsumer: this.selectedCmd.MessageToConsumer,
        cmdType: this.selectedCmd.ConsumerCommand,
      });
    }
    this.sessionService.setVariableToStorage('commandEditChanges', null);
    if (!this.selectedCmd && this.isCommandformVisible === false) this.formClear();
    if (this.selectedCmd) this.isChangeable = false;
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

  get commandName() {
    return this.editCommandForm.get('reservedCommandName');
  }

  get commandDescription() {
    return this.editCommandForm.get('reservedCommandDescription');
  }

  get commandMessage() {
    return this.editCommandForm.get('messageToConsumer');
  }

  get commandCode() {
    return this.editCommandForm.get('cmdType');
  }

  onSubmit() {
    let formValues;
    this.submitted = true;
    if (this.editCommandForm.invalid) {
      this.savingErrors++;
      return;
    } else {
      formValues = this.editCommandForm.getRawValue();
    }

    this.editedCommand = {
      CommandListOrder: 0,
      CompanyId: +this.usr.CompanyId,
      ReservedCommandId: 0,
      IsActive: true,
      MessageToConsumer: formValues.messageToConsumer,
      ReservedCommandDescription: formValues.reservedCommandDescription,
      ReservedCommandName: formValues.reservedCommandName,
      ConsumerCommand: formValues.cmdType
    }
    if (this.selectedCmd) {
      this.editedCommand.CommandListOrder = this.selectedCmd.CommandListOrder;
      this.editedCommand.CompanyId = this.selectedCmd.CompanyId;
      this.editedCommand.ReservedCommandId = this.selectedCmd.ReservedCommandId;
    }

    if (!this.selectedCmd) {
      this.commands.addReservedCommand(this.editedCommand).subscribe(
        async (result) => {
          if (result.ErrorMessage) {
            this.notify.openSnackBar(result.ErrorMessage);
          } else {
            this.finalize();
            this.notify.openSnackBar('The reserved command has been saved');
          }
        },
        (error) => {
          this.notify.openSnackBar(error.error.title);
        }
      );
    } else {
      this.commands.updateReservedCommand(this.editedCommand).subscribe(
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
    }
  }

  finalize(): void {
    this.editChangecounter = 0;
    this.sessionService.setVariableToStorage('commandEditChanges', null);
    this.cmdAdded.emit(true);
    this.formClear();
  }

  formClear(): void {
    this.submitted = false;
    this.savingErrors = 0;
    this.editCommandForm.reset(); 
    this.isSaveable = false;
  }

}
