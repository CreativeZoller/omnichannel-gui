import { Component, OnInit, Input, EventEmitter, Output, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from '@services/accounts.service';
import { NotificationService } from '@services/notification.service';
import { NewMessage } from '@models/messages';
import { SessionStorageService } from '@services/storageSession.service';
import { FormCheckingService } from '@services/form.check.service';
import { UserClaim } from '@models/UserClaim';
import { PersistService } from '@services/persist.service';
import { messageTemplate } from '@models/messageTemplate';
import { MessageTemplateService } from '@services/messageTemplate.service';
import { CommandsService } from '@services/commands.service';

@Component({
  selector: 'vt-message-form',
  templateUrl: './message-form.component.html',
})
export class MessageFormComponent implements OnInit {
  @Input() accountId: string;
  @Input() phoneNumber: string;
  @Input() optOut: boolean;
  public usr: UserClaim;
  public messageForm: FormGroup;
  public submitted = false;
  public editChangecounter: number;
  public isSaveable = false;
  public userClaims: string[];
  public freeTextAllowed: boolean = false;
  public templateTextAllowed: boolean = false;
  public textareaAvailable: boolean = false;
  public dropdownAvailable: boolean = false;
  public customerMessageItems: {};
  public messageTemplateItems: messageTemplate[];
  public originalTextareaContent: string;
  public updatedTextareaContent: string;
  public messageContent: string;

  constructor(
    private fb: FormBuilder,
    private notify: NotificationService,
    private accounts: AccountsService,
    public sessionService: SessionStorageService,
    public formService: FormCheckingService,
    private store: PersistService,
    private commands: CommandsService,
    public templateService: MessageTemplateService,
  ) {
    this.usr = this.store.get<UserClaim>('user');
    this.userClaims = this.usr?.Claims;
    this.freeTextAllowed = this.userClaims?.indexOf('OmniChannel.CommunicationTemplate_FreeText') > -1 ?? false;
    this.templateTextAllowed = this.userClaims?.indexOf('OmniChannel.CommunicationTemplate') > -1 ?? false;
    this.templateService.getTemplatesByCompany(this.usr.CompanyId).subscribe(
      (result) => {
        this.messageTemplateItems = result as messageTemplate[];
      },
      (error) => {
        this.notify.openSnackBar(error.error.title);
      }
    );
    this.commands.getCommandWords().subscribe(
      (result) => {
        this.customerMessageItems = result;
      },
      (error) => {
        this.notify.openSnackBar(error.error.title);
      }
    );
  }

  async ngOnInit() {
    this.messageForm = this.fb.group({
      newMessage: [{ value: '', disabled: true }, [Validators.minLength(4)]],
      newMessageTemplate: [{ value: 'null', disabled: true }, []],
    });
    if (this.freeTextAllowed) {
      this.textareaAvailable = true;
      this.messageForm.get('newMessage').enable({ emitEvent: false });
    }
    if (this.templateTextAllowed) { 
      this.dropdownAvailable = true;
      this.messageForm.get('newMessageTemplate').enable({ emitEvent: false });
    }
    this.originalTextareaContent = 'Type your message here';  
  }

  get message() {
    return this.messageForm.get('newMessage');
  }

  get template() {
    return this.messageForm.get('newMessageTemplate');
  }

  changeDetected(e) {
    const changes: number = this.formService.fieldChangeDetection(e);
    this.sessionService.setVariableToStorage('communicationMessageChanges', changes);
    this.editChangecounter = +this.sessionService.getVariableFromStorage('communicationMessageChanges');
    if (this.editChangecounter > 0) {
      this.isSaveable = true;
    } else {
      this.isSaveable = false;
    }
  }

  contentChange(e) {
    this.changeDetected(e);
    if (e.target.localName === 'select') {
      const templateId = e.target.value;
      const selectedTemplate = e.target.options.selectedIndex;      
      let textareaContent = document.getElementById('newMessageField') as HTMLInputElement;
      let filterableItems = this.messageTemplateItems;
      
      if (this.freeTextAllowed === true && this.templateTextAllowed) {
        if (selectedTemplate === 0) {
          this.messageForm.get('newMessage').enable({ emitEvent: false });
          textareaContent.value = '';
          textareaContent.placeholder = this.originalTextareaContent;
        } else {
          this.messageForm.get('newMessage').disable({ emitEvent: false });
          filterableItems = filterableItems.filter(i => templateId == i.TemplateId);
          this.updatedTextareaContent = filterableItems[0].TemplateText;
          textareaContent.value = this.updatedTextareaContent;
        }
      }
    }
    if (e.target.localName === 'textarea') {
      if (this.freeTextAllowed === true && this.templateTextAllowed) {
        const messageContent = this.messageForm.get('newMessage').value;
        if (messageContent.length > 0) {
          this.messageForm.get('newMessageTemplate').disable({ emitEvent: false });
        } else {
          this.messageForm.get('newMessageTemplate').enable({ emitEvent: false });
        }
      }
    }
  }

  formSubmit() {
    let formValues;
    let optionToFilter = this.messageTemplateItems;
    let sendingErrors = 0;
    let newMessage: NewMessage;
    this.submitted = true;
    if (this.messageForm.invalid) {
      sendingErrors++;
      return;
    } else {
      formValues = this.messageForm.getRawValue();
    }

    if (formValues.newMessage != '') {
      this.messageContent = formValues.newMessage;
    } else {
      optionToFilter = optionToFilter.filter(i => formValues.newMessageTemplate == i.TemplateId);
      this.messageContent = optionToFilter[0]?.TemplateText;
    }
    if(this.messageContent) {
      newMessage = {
        Message: this.messageContent,
        ReceiverNumber: this.phoneNumber,
        SendingNumber: '+12058284431',
        CompanyId: 1,
        AccountId: this.accountId.toLowerCase(),
      };
    }

    this.accounts.postNewMessage(newMessage).subscribe(
      (result) => {
        this.notify.openSnackBar('The message has been sent');
        this.formClear();
      },
      (error) => {
        sendingErrors++;
        this.notify.openSnackBar(error);
      }
    );
  }

  formClear(): void {
    this.submitted = false;
    this.messageForm.reset();
    this.editChangecounter = 0;
    this.isSaveable = false;
  }
}
