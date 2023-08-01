import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationsRequestPageComponent } from './communications-request-page.component';

describe('CommunicationsRequestPageComponent', () => {
  let component: CommunicationsRequestPageComponent;
  let fixture: ComponentFixture<CommunicationsRequestPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunicationsRequestPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationsRequestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
