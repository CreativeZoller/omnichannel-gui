import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@services/notification.service';
import { SessionStorageService } from '@services/storageSession.service';
import { FormCheckingService } from '@services/form.check.service';
import { changeVerificationMessages, verificationMessages } from '@models/verification';
import { VerificationService } from '@services/verification.service';
import { PersistService } from '@services/persist.service';
import { UserClaim } from '@models/UserClaim';

@Component({
  selector: 'vt-verification-message-form',
  templateUrl: './verification-message-form.component.html',
})
export class VerificationMessageFormComponent implements OnInit {
  @Input() verificationMsg;
  @Input() isOverlayVisible: boolean;
  @Input() originalMsg;
  @Output() msgChanged = new EventEmitter();
  editVerificationMSGForm: FormGroup;
  msgSubmitted = false;
  isMsgSaveable = false;
  msgErrors: number = 0;
  msgChangeCounter: number = 0;
  verificationMessages: verificationMessages;
  ErrorMessage: string;
  verification: string;
  updatedMsg: changeVerificationMessages;
  messageOptions: Array<string>;
  messageOptionsOut: Array<any>;
  selectedMsgType: any;
  selectedOption: string;

  constructor(
    private notify: NotificationService,
    private verifications: VerificationService,
    private fb: FormBuilder,
    public changeDetectorRef: ChangeDetectorRef,
    public sessionService: SessionStorageService,
    public formService: FormCheckingService,
    private store: PersistService
  ) {}

  ngOnInit(): void {
    this.messageOptions = ['InstructionalMessage', 'SuccessfulMessage', 'AttemptFailMessage', 'FailMessage', 'LockOutMessage'];
    this.editVerificationMSGForm = this.fb.group(
      {
        msgLabel: ['', [Validators.required]],
        msgText: ['', [Validators.required, , Validators.minLength(8)]],
      },
      { updateOn: 'change' }
    );
    if (this.verificationMsg) {
      this.verification = this.originalMsg.VerificationId;
      this.editVerificationMSGForm.patchValue({
        msgLabel: this.verificationMsg.Label,
        msgText: this.verificationMsg.Message,
      });
      const selectedType = +this.messageOptions.indexOf(this.verificationMsg.Label);
      this.selectedMsgType = this.messageOptions[selectedType];
    }
    this.sessionService.setVariableToStorage('verificationMsgChanges', this.msgChangeCounter);
  }

  changeDetected(e) {
    const changes: number = this.formService.fieldChangeDetection(e);
    this.sessionService.setVariableToStorage('verificationMsgChanges', changes);
    this.msgChangeCounter = +this.sessionService.getVariableFromStorage('verificationMsgChanges');
    if (this.msgChangeCounter > 0) {
      this.isMsgSaveable = true;
    } else {
      this.isMsgSaveable = false;
    }
  }

  get msgLabel() {
    return this.editVerificationMSGForm.get('msgLabel');
  }

  get msgText() {
    return this.editVerificationMSGForm.get('msgText');
  }

  messageLabelChange(deviceValue: string) {
    this.selectedOption = deviceValue;
  }

  verificationMsgSubmit() {
    var formValues;
    this.msgSubmitted = true;
    formValues = this.editVerificationMSGForm.getRawValue();
    const usr = this.store.get<UserClaim>('user');

    this.updatedMsg = {
      CompanyId: null,
      VerificationId: null,
      AttemptFailMessage: null,
      FailMessage: null,
      InstructionalMessage: null,
      LockOutMessage: null,
      SuccessfulMessage: null,
    };
    if (this.originalMsg) {
      this.updatedMsg.CompanyId = this.originalMsg.CompanyId;
      this.updatedMsg.VerificationId = this.originalMsg.VerificationId;
      this.updatedMsg.AttemptFailMessage = this.originalMsg.AttemptFailMessage;
      this.updatedMsg.FailMessage = this.originalMsg.FailMessage;
      this.updatedMsg.InstructionalMessage = this.originalMsg.InstructionalMessage;
      this.updatedMsg.LockOutMessage = this.originalMsg.LockOutMessage;
      this.updatedMsg.SuccessfulMessage = this.originalMsg.SuccessfulMessage;
    }
    if (!this.verificationMsg) {
      this.updatedMsg.CompanyId = +usr.CompanyId;
    }

    let editCase: string;
    if (!this.verificationMsg) {
      editCase = this.selectedOption;
    } else {
      editCase = this.verificationMsg.Label;
    }

    switch (editCase) {
      case 'AttemptFailMessage':
        this.updatedMsg.AttemptFailMessage = formValues.msgText;
        break;
      case 'FailMessage':
        this.updatedMsg.FailMessage = formValues.msgText;
        break;
      case 'InstructionalMessage':
        this.updatedMsg.InstructionalMessage = formValues.msgText;
        break;
      case 'LockOutMessage':
        this.updatedMsg.LockOutMessage = formValues.msgText;
        break;
      case 'SuccessfulMessage':
        this.updatedMsg.SuccessfulMessage = formValues.msgText;
        break;
      default:
        this.notify.openSnackBar('Sorry there was some error. Please try again later.');
    }

    if (this.verificationMsg) {
      this.verifications.updateVerificationMessages(this.updatedMsg).subscribe(
        (result) => {
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
      this.verifications.addVerificationMessages(this.updatedMsg).subscribe(
        (result) => {
          this.finalize();
          this.notify.openSnackBar('The modifications have been added');
        },
        (error) => {
          this.notify.openSnackBar(error.error.title);
        }
      );
    }
  }

  finalize(): void {
    this.msgChangeCounter = 0;
    this.sessionService.setVariableToStorage('verificationMsgChanges', null);
    this.msgChanged.emit(true);
    this.formClear();
  }

  formClear(): void {
    this.msgSubmitted = false;
    this.msgErrors = 0;
    this.editVerificationMSGForm.reset();
    this.isMsgSaveable = false;
  }
}
