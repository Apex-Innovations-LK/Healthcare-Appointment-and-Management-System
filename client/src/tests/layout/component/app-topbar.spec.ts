// tests/layout/component/app-topbar.spec.ts
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTopbar } from '../../../app/layout/component/app.topbar';
import { LayoutService } from '../../../app/layout/service/layout.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


describe('AppTopbar', () => {
  let fixture: ComponentFixture<AppTopbar>;
  let component: AppTopbar;
  let layoutService: LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTopbar, RouterTestingModule, NoopAnimationsModule],
      providers: [LayoutService],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(AppTopbar);
    component = fixture.componentInstance;
    layoutService = TestBed.inject(LayoutService);
    fixture.detectChanges();
  });

  it('toggleDarkMode flips darkTheme', () => {
    const before = layoutService.layoutConfig().darkTheme;
    component.toggleDarkMode();
    expect(layoutService.layoutConfig().darkTheme).toBe(!before);
  });

  it('renders logo SVG and buttons', () => {
    const svg = fixture.nativeElement.querySelector('svg');
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(svg).toBeTruthy();
    expect(buttons.length).toBeGreaterThan(0);
  });
});
