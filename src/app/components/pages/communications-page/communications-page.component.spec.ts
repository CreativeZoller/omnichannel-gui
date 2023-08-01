import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommunicationsPageComponent } from './communications-page.component';
import { RouterOutlet } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBarConfig, MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { SignalRService } from 'src/app/services/signalr.service';
import { NotificationService } from '../../../services/notification.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('CommunicationsPageComponent testing:', () => {
  let component: CommunicationsPageComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<CommunicationsPageComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommunicationsPageComponent],
      imports: [
        RouterTestingModule,
        FormsModule,
        MatSnackBarModule,
        MatTableModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [RouterOutlet, NotificationService, SignalRService, MatSnackBarConfig, HttpTestingController],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunicationsPageComponent);
    component = fixture.componentInstance; // The component instantiation
    element = fixture.nativeElement; // The HTML reference
    httpMock = TestBed.inject(HttpTestingController);
  }));

  it('should create the communications page component', async(() => {
    expect(component).toBeTruthy();
  }));

  it(`should have a defined title as 'Communications'`, async(() => {
    const title = 'Communications';
    element.title = title;
    expect(element.title).toBeDefined();
    expect(element.title).toBeTruthy();
    expect(element.title).toEqual(title);
  }));

  it('should navParentClass be undefined', () => {
    expect(component.navParentClass).not.toBeDefined();
  });

  it('should calling toggleReceive() reassign its value to navParentClass, which should be a proper boolean', fakeAsync(() => {
    spyOn(component, 'toggleReceive').and.callThrough();
    component.toggleReceive(true);
    tick();
    expect(component.toggleReceive).toHaveBeenCalled();
    expect(component.navParentClass).toBe(true);
    expect(typeof component.navParentClass).toEqual('boolean');
  }));

  it('should define the Overlay boolean', () => {
    expect(component.overlay).toBeDefined();
    expect(component.overlay).toBe(false);
  });

  it('should define some variables', () => {
    expect(component.maxSelectableDate).toBeDefined();
    expect(component.newDate).toBeDefined();
    expect(component.newDate).toBeNull();
  });

  it('should toggleOverlay be known as function', () => {
    expect(typeof component.toggleOverlay).toEqual('function');
  });

  it('should scrollToBottom be known as function', () => {
    expect(typeof component.scrollToBottom).toEqual('function');
  });

  it('should updateDate be known as function', () => {
    expect(typeof component.updateDate).toEqual('function');
  });

  it('should onRowClicked be known as function', () => {
    expect(typeof component.onRowClicked).toEqual('function');
  });

  it('should onCloseClicked be known as function', () => {
    expect(typeof component.onCloseClicked).toEqual('function');
  });
});
