import { TestBed, async, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardPageComponent } from './dashboard-page.component';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';

describe('DashboardPageComponent testing:', () => {
  let component: DashboardPageComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<DashboardPageComponent>;
  const route = { data: of({ pageTitle: 'Dashboard' }) } as any as ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardPageComponent],
      imports: [RouterTestingModule, BrowserAnimationsModule],
      providers: [RouterOutlet, { provide: ActivatedRoute, useValue: route }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance; // The component instantiation
    element = fixture.nativeElement; // The HTML reference
  }));

  it('should create the dashboard component', async(() => {
    expect(component).toBeTruthy();
  }));

  it(`should have a defined title as 'Dashboard'`, async(() => {
    const title = 'Dashboard';
    fixture.detectChanges();
    expect(component.pageTitle).toBeDefined();
    expect(component.pageTitle).toBeTruthy();
    expect(component.pageTitle).toEqual(title);
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
});
