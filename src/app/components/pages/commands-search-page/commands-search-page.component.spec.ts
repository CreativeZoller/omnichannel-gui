import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandsSearchPageComponent } from './commands-search-page.component';

describe('CommandsSearchPageComponent', () => {
  let component: CommandsSearchPageComponent;
  let fixture: ComponentFixture<CommandsSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommandsSearchPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandsSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
