import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCommandslistFormComponent } from './edit-commandslist-form.component';

describe('AddCommandlistFormComponent', () => {
  let component: EditCommandslistFormComponent;
  let fixture: ComponentFixture<EditCommandslistFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditCommandslistFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCommandslistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
