import { Injectable } from '@angular/core';
// This service is only to handle a variable where the form changes is calculated and returned
@Injectable()
export class FormCheckingService {
  constructor() {}

  public changeCount = 0;

  fieldChangeDetection(formElement) {
    const fieldTag: string = formElement.target.tagName.toLowerCase();
    const fieldType: string = formElement.target.type;

    switch (fieldTag) {
      case 'textarea':
        const textAreaValue: string = formElement.target.value.trim();
        if (textAreaValue) {
          this.changeCount++;
        } else {
          this.changeCount--;
        }
        break;
      case 'input':
        switch (fieldType) {
          case 'text':
          case 'email':
          case 'password':
            const fieldTextValue: string = formElement.target.value.trim();
            if (fieldTextValue) {
              this.changeCount++;
            } else {
              this.changeCount--;
            }
            break;
          case 'radio':
          case 'checkbox':
            this.changeCount++;
            break;
          case 'tel':
            const fieldNumberValue: number = formElement.target.value.trim();
            if (fieldNumberValue) {
              this.changeCount++;
            } else {
              this.changeCount--;
            }
            break;
          default:
            console.warn('Unhandled input type is detected: ' + fieldType);
            break;
        }
        break;
      case 'select':
        const selectOptionIndex: number = formElement.target.options.selectedIndex;
        if (selectOptionIndex >= 1) {
          this.changeCount++;
        } else {
          this.changeCount--;
        }
        break;
      default:
        console.warn('Unhandled form tag is detected: ' + fieldTag);
        break;
    }

    return this.changeCount;
  }
}
