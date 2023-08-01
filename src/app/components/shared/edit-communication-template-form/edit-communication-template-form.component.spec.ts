import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCommunicationTemplateFormComponent } from './edit-communication-template-form.component';

describe('EditCommunicationTemplateFormComponent', () => {
  let component: EditCommunicationTemplateFormComponent;
  let fixture: ComponentFixture<EditCommunicationTemplateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCommunicationTemplateFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCommunicationTemplateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
