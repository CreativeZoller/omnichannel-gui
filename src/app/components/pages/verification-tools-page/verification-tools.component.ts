import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { UserClaim } from '@models/UserClaim';
import { changeVerificationQuestions, customMessageData } from '@models/verification';
import { FormCheckingService } from '@services/form.check.service';
import { PersistService } from '@services/persist.service';
import { SessionStorageService } from '@services/storageSession.service';
import { ConfirmDialogService } from '@services/confirmDialog.service';
import { VerificationService } from '@services/verification.service';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'vt-verification-tools',
  templateUrl: './verification-tools.component.html',
  styleUrls: ['./verification-tools.component.scss'],
})
export class VerificationToolsComponent implements OnInit {
  overlay = false;
  isNotActive = true;
  isMessageVisible = false;
  isQuestionVisible = false;
  noMessages = true;
  noQuestions = true;
  canImplementMsg = true;
  canImplementQtn = true;
  canRemoveQtn = true;
  selectedMessage: any;
  selectedQuestion: any;
  pageTitle: any;
  user: UserClaim;
  navParentClass: boolean;
  verificationMessages: any;
  verificationId: string;
  ErrorMessage: string;
  InstructionalMessage: string;
  SuccessfulMessage: string;
  AttemptFailMessage: string;
  FailMessage: string;
  LockOutMessage: string;
  msgColumnsToDisplay: string[];
  qtnColumnsToDisplay: string[];
  msgData: any;
  qtnData: any;
  messagesRawData: any;
  questionRawData: any;
  initialMsgCount: number = 0;
  initialMessages = {
    InstructionalMessage: null,
    SuccessfulMessage: null,
    AttemptFailMessage: null,
    FailMessage: null,
    LockOutMessage: null,
  };

  constructor(
    private activatedroute: ActivatedRoute,
    private store: PersistService,
    public sessionService: SessionStorageService,
    public formService: FormCheckingService,
    public changeDetectorRef: ChangeDetectorRef,
    private dialogService: ConfirmDialogService,
    private verificationMsgs: VerificationService,
    private notify: NotificationService
  ) {
    this.activatedroute.data.subscribe((data) => {
      this.pageTitle = data.pageTitle;
      this.user = this.store.get<UserClaim>('user');
      this.messagesRawData = data.verificationData;
      this.ErrorMessage = data.verificationData.ErrorMessage;
      this.verificationId = data.verificationData.verificationId;
      this.questionRawData = data.verificationData.VerificationQuestions;
      if (this.ErrorMessage == '') {
        this.findMessages(this.messagesRawData);
        if (this.questionRawData.length === 0) this.noQuestions = true;
        if (this.questionRawData.length != 0) this.noQuestions = false;
        if (this.questionRawData.length >= 3) this.canImplementQtn = false;
        if (this.questionRawData.length <= 1) this.canRemoveQtn = false;
        if (this.initialMsgCount === 0) this.noMessages = true;
        if (this.initialMsgCount != 0) {
          this.noMessages = false;
          this.canImplementMsg = false;
        }

        this.verificationMessages = this.findAndPush(data.verificationData);
        this.msgColumnsToDisplay = ['Label', 'Message', 'Actions'];
        this.msgData = new MatTableDataSource<customMessageData>(this.verificationMessages);
        this.qtnColumnsToDisplay = ['QuestionToConsumer', 'AnswerValidationOption', 'AttemptCount', 'Actions'];
        this.qtnData = new MatTableDataSource<changeVerificationQuestions>(this.questionRawData);
      }
    });
  }

  ngOnInit() {}

  findMessages(rawData): void {
    if (rawData.InstructionalMessage != null) this.initialMessages.InstructionalMessage = rawData.InstructionalMessage;
    if (rawData.SuccessfulMessage != null) this.initialMessages.SuccessfulMessage = rawData.SuccessfulMessage;
    if (rawData.AttemptFailMessage != null) this.initialMessages.AttemptFailMessage = rawData.AttemptFailMessage;
    if (rawData.FailMessage != null) this.initialMessages.FailMessage = rawData.FailMessage;
    if (rawData.LockOutMessage != null) this.initialMessages.LockOutMessage = rawData.LockOutMessage;

    Object.keys(this.initialMessages).forEach((key) => {
      if (this.initialMessages[key] !== null) {
        this.initialMsgCount++;
      }
    });
  }

  findAndPush(rawData) {
    let finishedObject = [];
    if (rawData.hasOwnProperty('AttemptFailMessage')) {
      const additionAttempt: customMessageData = { Label: 'AttemptFailMessage', Message: this.messagesRawData.AttemptFailMessage };
      finishedObject.push(additionAttempt);
    }
    if (rawData.hasOwnProperty('FailMessage')) {
      const additionFail: customMessageData = { Label: 'FailMessage', Message: this.messagesRawData.FailMessage };
      finishedObject.push(additionFail);
    }
    if (rawData.hasOwnProperty('InstructionalMessage')) {
      const additionInstruction: customMessageData = { Label: 'InstructionalMessage', Message: this.messagesRawData.InstructionalMessage };
      finishedObject.push(additionInstruction);
    }
    if (rawData.hasOwnProperty('LockOutMessage')) {
      const additionLockout: customMessageData = { Label: 'LockOutMessage', Message: this.messagesRawData.LockOutMessage };
      finishedObject.push(additionLockout);
    }
    if (rawData.hasOwnProperty('SuccessfulMessage')) {
      const additionSuccess: customMessageData = { Label: 'SuccessfulMessage', Message: this.messagesRawData.SuccessfulMessage };
      finishedObject.push(additionSuccess);
    }
    return finishedObject;
  }

  modifyMessage(message: any | boolean) {
    if (!message) {
      this.sessionService.setVariableToStorage('selectedMessage', null);
      this.toggleMessageOverlay();
    } else {
      const row = message;
      this.sessionService.setVariableToStorage('selectedMessage', row.label);
      this.selectedMessage = row;
      this.toggleMessageOverlay();
    }
  }

  modifyQuestion(question: any | boolean) {
    if (!question) {
      this.sessionService.setVariableToStorage('selectedQuestion', null);
      this.toggleQuestionOverlay();
    } else {
      const row = question;
      this.sessionService.setVariableToStorage('selectedQuestion', row.QuestionToConsumer);
      this.selectedQuestion = row;
      this.toggleQuestionOverlay();
    }
  }

  toggleMessageOverlay(): void {
    const overlayContainer = document.querySelector('#messages-overlay');
    const overlayBg = document.querySelector('.messages-overlay');
    const body = document.querySelector('body');
    overlayContainer.classList.toggle('active');
    overlayBg.classList.toggle('active');
    body.classList.toggle('active');
    this.overlay = !this.overlay;
    this.isMessageVisible = true;
    if (this.overlay === true) {
      this.onMsgOverlayClicked();
    }
  }

  toggleQuestionOverlay(): void {
    const overlayContainer = document.querySelector('#questions-overlay');
    const overlayBg = document.querySelector('.questions-overlay');
    const body = document.querySelector('body');
    overlayContainer.classList.toggle('active');
    overlayBg.classList.toggle('active');
    body.classList.toggle('active');
    this.overlay = !this.overlay;
    this.isMessageVisible = true;
    if (this.overlay === true) {
      this.onQtnOverlayClicked();
    }
  }

  toggleReceive($event) {
    this.navParentClass = $event;
  }

  onMsgOverlayClicked() {
    const overlay = document.querySelector('.messages-overlay') as HTMLElement;
    overlay.addEventListener('click', this.handleMsgDialog);
  }

  onQtnOverlayClicked() {
    const overlay = document.querySelector('.questions-overlay') as HTMLElement;
    overlay.addEventListener('click', this.handleQtnDialog);
  }

  handleMsgDialog() {
    const overlay = document.querySelector('.messages-overlay') as HTMLElement;
    if (overlay === event.target) {
      const closeBtn: HTMLElement = document.getElementsByClassName('sidebar-close')[0] as HTMLElement;
      closeBtn.click();
    }
    if (this.selectedMessage === '') document.removeEventListener('click', this.handleMsgDialog);
  }

  handleQtnDialog() {
    const overlay = document.querySelector('.questions-overlay') as HTMLElement;
    if (overlay === event.target) {
      const closeBtn: HTMLElement = document.getElementsByClassName('sidebar-close')[0] as HTMLElement;
      closeBtn.click();
    }
    if (this.selectedMessage === '') document.removeEventListener('click', this.handleQtnDialog);
  }

  onMsgCloseClicked() {
    const changedVariables: number = +this.sessionService.getVariableFromStorage('verificationMsgChanges');
    if (changedVariables > 0) {
      this.openConfirmMsgDialog();
    } else {
      this.toggleMessageOverlay();
      this.selectedMessage = '';
      this.sessionService.setVariableToStorage('selectedMessage', null);
      this.sessionService.setVariableToStorage('verificationMsgChanges', null);
      this.isMessageVisible = false;
    }
  }

  onQtnCloseClicked() {
    const changedVariables: number = +this.sessionService.getVariableFromStorage('verificationQtnChanges');
    if (changedVariables > 0) {
      this.openConfirmQtnDialog();
    } else {
      this.toggleQuestionOverlay();
      this.selectedQuestion = '';
      this.sessionService.setVariableToStorage('selectedQuestion', null);
      this.sessionService.setVariableToStorage('verificationQtnChanges', null);
      this.isMessageVisible = false;
    }
  }

  openConfirmMsgDialog() {
    const dialogOptions = {
      title: 'Are You sure?',
      message: 'There may be unsaved modifications. If you proceed now, they will be lost. To hold those changes, please save first.',
      cancelText: 'Cancel',
      confirmText: 'Proceed',
    };
    this.dialogService.open(dialogOptions);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.toggleMessageOverlay();
        this.selectedMessage = '';
        this.sessionService.setVariableToStorage('selectedMessage', null);
        this.sessionService.setVariableToStorage('verificationMsgChanges', null);
        this.isMessageVisible = false;
      }
    });
  }

  openConfirmQtnDialog() {
    const dialogOptions = {
      title: 'Are You sure?',
      message: 'There may be unsaved modifications. If you proceed now, they will be lost. To hold those changes, please save first.',
      cancelText: 'Cancel',
      confirmText: 'Proceed',
    };
    this.dialogService.open(dialogOptions);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.toggleQuestionOverlay();
        this.selectedQuestion = '';
        this.sessionService.setVariableToStorage('selectedQuestion', null);
        this.sessionService.setVariableToStorage('verificationQtnChanges', null);
        this.isMessageVisible = false;
      }
    });
  }

  showDeleteQtnDialog(element) {
    const dialogOptions = {
      title: 'Are You sure?',
      message: 'The selected question will be removed if you choose to proceed.',
      cancelText: 'Cancel',
      confirmText: 'Proceed',
    };
    this.dialogService.open(dialogOptions);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.verificationMsgs.removeVerificationQuestions(element.VerificationQuestionId).subscribe(
          (result) => {
            this.notify.openSnackBar('The selected question has been deleted');
            setTimeout(() => {
              this.refreshQuestions();
            }, 500);
          },
          (error) => {
            this.notify.openSnackBar(error.error.title);
          }
        );
      }
    });
  }

  forceRefreshMsg(info: any) {
    this.onMsgCloseClicked();
    this.noMessages = false;
    setTimeout(() => {
      this.refreshMessages();
    }, 500);
  }

  forceRefreshQtn(info: any) {
    this.onQtnCloseClicked();
    this.noQuestions = false;
    setTimeout(() => {
      this.refreshQuestions();
    }, 500);
  }

  refreshQuestions() {
    this.verificationMsgs.getVerificationMessages(this.user.CompanyId).subscribe(
      (res) => {
        this.questionRawData = res.VerificationQuestions;
        if (this.questionRawData.length === 0) {
          this.noQuestions = true;
        } else {
          this.noQuestions = false;
        }
        if (this.questionRawData.length >= 3) {
          this.canImplementQtn = false;
        } else {
          this.canImplementQtn = true;
        }
        if (this.questionRawData.length <= 1) {
          this.canRemoveQtn = false;
        } else {
          this.canRemoveQtn = true;
        }
        this.qtnColumnsToDisplay = ['QuestionToConsumer', 'AnswerValidationOption', 'AttemptCount', 'Actions'];
        this.qtnData = new MatTableDataSource<changeVerificationQuestions>(this.questionRawData);
        this.changeDetectorRef.detectChanges();
      },
      (error) => {
        this.notify.openSnackBar(error);
      }
    );
  }

  refreshMessages() {
    this.verificationMsgs.getVerificationMessages(this.user.CompanyId).subscribe(
      (res) => {
        this.messagesRawData = res;
        this.ErrorMessage = this.messagesRawData.ErrorMessage;
        if (this.ErrorMessage == '') {
          this.findMessages(this.messagesRawData);
          if (this.initialMsgCount === 0) {
            this.noMessages = true;
            this.canImplementMsg = true;
          } else {
            this.noMessages = false;
            this.canImplementMsg = false;
          }

          this.verificationId = this.messagesRawData.VerificationId;
          this.verificationMessages = this.findAndPush(this.messagesRawData);
          this.msgColumnsToDisplay = ['Label', 'Message', 'Actions'];
          this.msgData = new MatTableDataSource<customMessageData>(this.verificationMessages);
          this.changeDetectorRef.detectChanges();
        }
      },
      (error) => {
        this.notify.openSnackBar(error);
      }
    );
  }
}
