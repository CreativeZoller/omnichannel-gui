import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { ModalComponent } from './modal/modal.component';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { OktaAuthModule, OktaAuthService, OKTA_CONFIG } from '@okta/okta-angular';
import { LocalSessionService } from 'src/app/services/localSession.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { Constants } from 'src/app/constants';

const oktaConfig = {
  issuer: Constants.issuer,
  redirectUri: Constants.redirectUri,
  clientId: Constants.clientId,
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
};

export class MockNgbModalRef {
  componentInstance = {
    title: 'Are You ready to leave?',
    content: 'Select "Logout" below if you are ready to end your current session.',
    actionButtonText: 'Proceed',
    closeButtonText: 'Cancel',
  };
  result: Promise<any> = new Promise((resolve, reject) => resolve(true));
}

describe('NavbarComponent testing:', () => {
  let component: NavbarComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<NavbarComponent>;
  let ngbModal: NgbModal;
  const mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent, ModalComponent],
      imports: [RouterTestingModule, NgbModule, OktaAuthModule],
      providers: [
        RouterOutlet,
        NgbModal,
        NgbActiveModal,
        LocalSessionService,
        OktaAuthService,
        Idle,
        Keepalive,
        { provide: OKTA_CONFIG, useValue: oktaConfig },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance; // The component instantiation
    element = fixture.nativeElement; // The HTML reference
    ngbModal = TestBed.inject(NgbModal);
    fixture.detectChanges();
  }));

  it('should create the shared navbar component', () => {
    expect(component).toBeTruthy();
  });

  it('should openModal() be known as function', () => {
    expect(typeof component.openModal).toEqual('function');
  });

  it('should clicking on Logout menuitem call openModal()', fakeAsync(() => {
    const modalButton = fixture.debugElement.query(By.css('#logout-button')).nativeElement;
    spyOn(component, 'openModal').and.callThrough();
    modalButton.click();
    tick();
    expect(component.openModal).toHaveBeenCalled();
  }));

  it('should calling openModal() open a new modal', () => {
    spyOn(ngbModal, 'open').and.returnValue(mockModalRef as any);
    component.openModal();
    expect(ngbModal.open).toHaveBeenCalledWith(ModalComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      keyboard: false,
      backdrop: 'static',
    });
  });

  it('should set the content of the modal by default', () => {
    spyOn(ngbModal, 'open').and.returnValue(mockModalRef as any);
    component.openModal();
    expect(mockModalRef.componentInstance.title).toBe('Are You ready to leave?');
    expect(mockModalRef.componentInstance.content).toBe('Select "Logout" below if you are ready to end your current session.');
    expect(mockModalRef.componentInstance.actionButtonText).toBe('Proceed');
    expect(mockModalRef.componentInstance.closeButtonText).toBe('Cancel');
  });

  it('should return true value as result when dismissing the modal with save button', () => {
    spyOn(ngbModal, 'open').and.returnValue(mockModalRef as any);
    // IDK actually what should I test here...
    mockModalRef.result = new Promise((resolve, reject) => resolve(true));
    expect(mockModalRef.result).toBeTruthy();
  });

  it('should return false value as result when closing the modal', () => {
    spyOn(ngbModal, 'open').and.returnValue(mockModalRef as any);
    // IDK actually what should I test here...
    mockModalRef.result = new Promise((resolve, reject) => reject(false));
    expect(mockModalRef.result).toBeTruthy();
  });

  it('should toggleBoolean() be known as function', () => {
    expect(typeof component.toggleBoolean).toEqual('function');
  });

  it('should toggleBoolean() switch boolean value', fakeAsync(() => {
    expect(typeof component.toggle).toEqual('boolean');
    expect(component.toggle).toBeDefined();
    expect(component.toggle).toBe(false);
    spyOn(component, 'toggleBoolean').and.callThrough();
    component.toggleBoolean();
    tick();
    expect(component.toggleBoolean).toHaveBeenCalled();
    expect(component.toggle).toBe(true);
  }));

  it('should toggleParentClass() be known as function', () => {
    expect(typeof component.toggleParentClass).toEqual('function');
  });

  it('should toggleParentClass() switch boolean value and emit it to parent components', fakeAsync(() => {
    expect(typeof component.hidden).toEqual('boolean');
    expect(component.hidden).toBeDefined();
    expect(component.hidden).toBe(false);
    spyOn(component, 'toggleParentClass').and.callThrough();
    component.toggleParentClass();
    tick();
    expect(component.toggleParentClass).toHaveBeenCalled();
    expect(component.hidden).toBe(true);
  }));
});
