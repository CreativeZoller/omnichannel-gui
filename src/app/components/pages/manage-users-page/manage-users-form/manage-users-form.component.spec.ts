import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUsersFormComponent } from './manage-users-form.component';

describe('ManageUsersFormComponent', () => {
  let component: ManageUsersFormComponent;
  let fixture: ComponentFixture<ManageUsersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUsersFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUsersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
