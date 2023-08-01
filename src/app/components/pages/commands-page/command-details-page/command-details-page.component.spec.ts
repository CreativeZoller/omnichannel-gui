import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandDetailsPageComponent } from './command-details-page.component';

describe('CommandDetailsPageComponent', () => {
  let component: CommandDetailsPageComponent;
  let fixture: ComponentFixture<CommandDetailsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommandDetailsPageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
