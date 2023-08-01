import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationTemplatesComponent } from './communication-templates.component';

describe('CommunicationTemplatesComponent', () => {
  let component: CommunicationTemplatesComponent;
  let fixture: ComponentFixture<CommunicationTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunicationTemplatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
