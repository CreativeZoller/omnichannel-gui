import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationToolsComponent } from './verification-tools.component';

describe('VerificationToolsComponent', () => {
  let component: VerificationToolsComponent;
  let fixture: ComponentFixture<VerificationToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerificationToolsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
