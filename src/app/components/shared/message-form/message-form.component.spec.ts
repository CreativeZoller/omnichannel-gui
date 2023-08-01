import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBarConfig } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageFormComponent } from './message-form.component';
import { AccountsService } from 'src/app/services/accounts.service';

describe('MessageFormComponent testing:', () => {
  let component: MessageFormComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<MessageFormComponent>;
  let httpMock: HttpTestingController;
  let serviceMock: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MessageFormComponent],
      imports: [MatSnackBarModule, HttpClientModule, HttpClientTestingModule, ReactiveFormsModule],
      providers: [FormBuilder, MatSnackBarConfig, HttpTestingController, AccountsService],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageFormComponent);
    component = fixture.componentInstance; // The component instantiation
    element = fixture.nativeElement; // The HTML reference
    httpMock = TestBed.inject(HttpTestingController);
    serviceMock = TestBed.inject(AccountsService);
  }));

  it('should create the new message form component', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when message field is empty in the form component', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.messageForm.valid).toBeFalsy();
  });

  it('should be valid when message field has a value of 4 chars at least', () => {
    component.ngOnInit();
    const message = component.messageForm.controls['newMessage'];
    expect(message.valid).toBeFalsy();
    message.setValue('');
    expect(message.hasError('required')).toBeTruthy();
    message.setValue('WASDF');
    expect(message.hasError('minLength')).toBeFalsy();
  });

  it('should define some form-related variables to proper form', () => {
    component.accountId = 'test input string';
    component.phoneNumber = 'test input string';
    component.ngOnInit();
    expect(component.submitted).toBeDefined();
    expect(component.submitted).toBe(false);
    expect(component.messageForm).toBeDefined();
    expect(component.accountId).toBeDefined();
    expect(typeof component.accountId).toEqual('string');
    expect(component.phoneNumber).toBeDefined();
    expect(typeof component.phoneNumber).toEqual('string');
  });

  it('should calling formClear() reset form values', () => {
    component.ngOnInit();
    expect(typeof component.formClear).toEqual('function');
    expect(component.messageForm).toBeDefined();
    expect(typeof component.messageForm).toBe('object');
    spyOn(component, 'formClear').and.callThrough();
    component.formClear();
    expect(component.formClear).toHaveBeenCalled();
    expect(component.submitted).toBe(false);
  });

  it('should calling formSubmit() send form values', () => {
    component.ngOnInit();
    expect(typeof component.formSubmit).toEqual('function');
    spyOn(component, 'formSubmit').and.callThrough();
    component.formSubmit();
    expect(component.formSubmit).toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('should submitting the form call postNewMessage() via API call', () => {
    // TODO: finish this
  });
});
