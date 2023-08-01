import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent testing:', () => {
  let component: SidebarComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidebarComponent
      ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        RouterOutlet
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance; // The component instantiation
    element = fixture.nativeElement; // The HTML reference
  }));

  it('should create the shared sidebar component', () => {
    expect(component).toBeTruthy();
  });

});
