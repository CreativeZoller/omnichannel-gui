import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterOutlet } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { OKTA_CONFIG, OktaAuthModule } from '@okta/okta-angular';
import { SignalRService } from './services/signalr.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Constants } from './constants';

describe('AppComponent testing:', () => {
  let component: AppComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<AppComponent>;

  const oktaConfig = {
    issuer: Constants.issuer,
    redirectUri: Constants.redirectUri,
    clientId: Constants.clientId,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule, BrowserAnimationsModule, HttpClientTestingModule, OktaAuthModule],
      providers: [RouterOutlet, { provide: OKTA_CONFIG, useValue: oktaConfig }, SignalRService, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance; // The component instantiation
    element = fixture.nativeElement; // The HTML reference
  }));

  it('should create the app component', async(() => {
    expect(component).toBeTruthy();
  }));

  it(`should have a defined title as 'Omnichannel Communication GUI'`, async(() => {
    component.ngOnInit();
    const title = 'Omnichannel Communication GUI';
    expect(component.title).toBeDefined();
    expect(component.title).toBeTruthy();
    expect(component.title).toEqual(title);
  }));
});
