import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { updateTemplate } from '@models/messageTemplate';
import { UserClaim } from '@models/UserClaim';
import { FormCheckingService } from '@services/form.check.service';
import { MessageTemplateService } from '@services/messageTemplate.service';
import { NotificationService } from '@services/notification.service';
import { PersistService } from '@services/persist.service';
import { SessionStorageService } from '@services/storageSession.service';

@Component({
  selector: 'vt-edit-communication-template-form',
  templateUrl: './edit-communication-template-form.component.html'
})
export class EditCommunicationTemplateFormComponent implements OnInit {
  @Input() template: any;
  @Input() isTemplateFormVisible: boolean;
  @Output() templateUpdated = new EventEmitter();
  usr: UserClaim;
  userClaims: string[];
  messageForm: FormGroup;
  submitted = false;
  savingErrors = 0;
  editChangecounter: number;
  isSaveable = false;
  templateUpdate: updateTemplate;

  constructor(
    private fb: FormBuilder,
    private notify: NotificationService,
    public sessionService: SessionStorageService,
    public formService: FormCheckingService,
    private store: PersistService,
    private templates: MessageTemplateService,
  ) {
    this.usr = this.store.get<UserClaim>('user');
    this.userClaims = this.usr?.Claims;
  }

  ngOnInit() {
    this.messageForm = this.fb.group(
      {
        editTemplateName: ['', [Validators.required, , Validators.minLength(4)]],
        editTemplateText: ['', [Validators.required, , Validators.minLength(4)]],
      },
      { updateOn: 'change' }
    );
    if (this.template) {
      this.messageForm.patchValue({
        editTemplateName: this.template.TemplateName,
        editTemplateText: this.template.TemplateText,
      });
    }
    this.sessionService.setVariableToStorage('templateMessageChanges', this.editChangecounter);
  }

  changeDetected(e) {
    const changes: number = this.formService.fieldChangeDetection(e);
    this.sessionService.setVariableToStorage('templateMessageChanges', changes);
    this.editChangecounter = +this.sessionService.getVariableFromStorage('templateMessageChanges');
    if (this.editChangecounter > 0) {
      this.isSaveable = true;
    } else {
      this.isSaveable = false;
    }
  }

  get name() {
    return this.messageForm.get('editTemplateName');
  }

  get text() {
    return this.messageForm.get('editTemplateText');
  }

  formSubmit() {
    let sendingErrors = 0;
    this.submitted = true;
    if (this.messageForm.invalid) {
      sendingErrors++;
      return;
    }
    let formValues = this.messageForm.getRawValue();

    this.templateUpdate = {
      name: formValues.editTemplateName,
      text: formValues.editTemplateText,
      companyId: this.usr.CompanyId,
    }
    if (this.template) {
      this.templateUpdate.id = this.template.TemplateId;
    }
    if (this.template)  {
      this.templates.updateMessageTemplate(this.templateUpdate).subscribe(
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
      this.templates.addMessageTemplate(this.templateUpdate).subscribe(
        async (result) => {
          if (result.ErrorMessage) {
            this.notify.openSnackBar(result.ErrorMessage);
          } else {
            this.finalize();
            this.notify.openSnackBar('The template has been saved');
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
    this.sessionService.setVariableToStorage('templateMessageChanges', null);
    this.templateUpdated.emit(true);
    this.formClear();
  }

  formClear(): void {
    this.submitted = false;
    this.savingErrors = 0;
    this.messageForm.reset();
    this.isSaveable = false;
  }

}
