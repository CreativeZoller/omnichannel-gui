import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservedCommandsComponent } from './reserved-commands.component';

describe('ReservedCommandsComponent', () => {
  let component: ReservedCommandsComponent;
  let fixture: ComponentFixture<ReservedCommandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservedCommandsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservedCommandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
