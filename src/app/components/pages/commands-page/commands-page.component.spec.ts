import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandsPageComponent } from './commands-page.component';

describe('CommandsPageComponent', () => {
  let component: CommandsPageComponent;
  let fixture: ComponentFixture<CommandsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommandsPageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
