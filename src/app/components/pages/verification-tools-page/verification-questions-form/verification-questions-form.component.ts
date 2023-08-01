import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@services/notification.service';
import { SessionStorageService } from '@services/storageSession.service';
import { FormCheckingService } from '@services/form.check.service';
import { VerificationService } from '@services/verification.service';
import { changeVerificationQuestions } from '@models/verification';

@Component({
  selector: 'vt-verification-questions-form',
  templateUrl: './verification-questions-form.component.html',
})
export class VerificationQuestionFormComponent implements OnInit {
  @Input() verificationQtn;
  @Input() isOverlayVisible: boolean;
  @Input() originalQtn;
  @Output() qtnChanged = new EventEmitter();
  editVerificationQTNForm: FormGroup;
  qtnSubmitted = false;
  isQtnSaveable = false;
  qtnErrors: number = 0;
  qtnChangeCounter: number = 0;
  ErrorMessage: string;
  qtnTypeArray: any;
  selectedQtnType: any;
  updatedQtn: changeVerificationQuestions;
  baseQtn: any;
  verification: string;

  constructor(
    private notify: NotificationService,
    private verifications: VerificationService,
    private fb: FormBuilder,
    public changeDetectorRef: ChangeDetectorRef,
    public sessionService: SessionStorageService,
    public formService: FormCheckingService
  ) {}

  ngOnInit() {
    this.editVerificationQTNForm = this.fb.group(
      {
        attemptCount: ['', [Validators.required]],
        qtnMsg: ['', [Validators.required, , Validators.minLength(8)]],
        qtnType: ['', [Validators.required]],
      },
      { updateOn: 'change' }
    );
    this.verification = this.originalQtn.VerificationId;
    if (this.verificationQtn) {
      this.baseQtn = this.originalQtn.VerificationQuestions;
      this.editVerificationQTNForm.patchValue({
        attemptCount: this.verificationQtn.AttemptCount,
        qtnMsg: this.verificationQtn.QuestionToConsumer,
        qtnType: this.verificationQtn.AnswerValidationOption,
      });
    }
    this.sessionService.setVariableToStorage('verificationQtnChanges', this.qtnChangeCounter);

    this.verifications.getVerificationQuestionTypes().subscribe(
      (res) => {
        this.qtnTypeArray = res;
        if (this.verificationQtn) {
          let selectedType = +this.qtnTypeArray.indexOf(this.verificationQtn.AnswerValidationOption);
          this.selectedQtnType = this.qtnTypeArray[selectedType];
        }
      },
      (err) => {
        this.notify.openSnackBar(err.error.title);
      }
    );
  }

  changeDetected(e) {
    const changes: number = this.formService.fieldChangeDetection(e);
    this.sessionService.setVariableToStorage('verificationQtnChanges', changes);
    this.qtnChangeCounter = +this.sessionService.getVariableFromStorage('verificationQtnChanges');
    if (this.qtnChangeCounter > 0) {
      this.isQtnSaveable = true;
    } else {
      this.isQtnSaveable = false;
    }
  }

  get attemptCount() {
    return this.editVerificationQTNForm.get('attemptCount');
  }

  get qtnMsg() {
    return this.editVerificationQTNForm.get('qtnMsg');
  }

  get qtnType() {
    return this.editVerificationQTNForm.get('qtnType');
  }

  verificationQtnSubmit() {
    let formValues;
    this.qtnSubmitted = true;
    if (this.editVerificationQTNForm.invalid) {
      this.qtnErrors++;
      return;
    } else {
      formValues = this.editVerificationQTNForm.getRawValue();
    }

    this.updatedQtn = {
      VerificationId: this.originalQtn.VerificationId,
      VerificationQuestionId: null,
      QuestionToConsumer: formValues.qtnMsg,
      AnswerValidationOption: formValues.qtnType,
      AttemptCount: +formValues.attemptCount,
    };
    if (this.verificationQtn) {
      this.updatedQtn.VerificationQuestionId = this.verificationQtn.VerificationQuestionId;
    }

    if (this.verificationQtn) {
      this.verifications.updateVerificationQuestions(this.updatedQtn).subscribe(
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
      this.verifications.addVerificationQuestions(this.updatedQtn).subscribe(
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
    }
  }

  finalize(): void {
    this.qtnChangeCounter = 0;
    this.sessionService.setVariableToStorage('verificationQtnChanges', null);
    this.qtnChanged.emit(true);
    this.formClear();
  }

  formClear(): void {
    this.qtnSubmitted = false;
    this.qtnErrors = 0;
    this.editVerificationQTNForm.reset();
    this.isQtnSaveable = false;
  }
}
