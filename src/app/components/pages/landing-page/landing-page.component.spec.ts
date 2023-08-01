import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LandingPageComponent } from './landing-page.component';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs/internal/observable/of';
import { OKTA_CONFIG, OktaAuthModule, OktaAuthService } from '@okta/okta-angular';
import { Constants } from 'src/app/constants';

describe('LandingPageComponent testing:', () => {
  let component: LandingPageComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<LandingPageComponent>;
  const route = ({ data: of({ pageTitle: 'Landing page' }) } as any) as ActivatedRoute;

  const oktaConfig = {
    issuer: Constants.issuer,
    redirectUri: Constants.redirectUri,
    clientId: Constants.clientId,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LandingPageComponent],
      imports: [RouterTestingModule, BrowserAnimationsModule, OktaAuthModule],
      providers: [
        RouterOutlet,
        OktaAuthService,
        { provide: OKTA_CONFIG, useValue: oktaConfig },
        { provide: ActivatedRoute, useValue: route },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance; // The component instantiation
    element = fixture.nativeElement; // The HTML reference
  }));

  it('should create the landing page component', async(() => {
    expect(component).toBeTruthy();
  }));

  it(`should have a defined title as 'Landing page'`, async(() => {
    component.ngOnInit();
    // TODO: fix for async ngOninit
    const title = 'Landing page';
    fixture.detectChanges();
    expect(component.pageTitle).toBeDefined();
    expect(component.pageTitle).toBeTruthy();
    expect(component.pageTitle).toEqual(title);
  }));
});
