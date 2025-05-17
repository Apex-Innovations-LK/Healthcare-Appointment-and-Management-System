import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppFloatingConfigurator } from '../../../app/layout/component/app.floatingconfigurator';
import { LayoutService } from '../../../app/layout/service/layout.service';

describe('AppFloatingConfigurator', () => {
  let fixture: ComponentFixture<AppFloatingConfigurator>;
  let component: AppFloatingConfigurator;
  let layoutService: LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppFloatingConfigurator],
      providers: [LayoutService]
    });
    fixture = TestBed.createComponent(AppFloatingConfigurator);
    component = fixture.componentInstance;
    layoutService = TestBed.inject(LayoutService);
    fixture.detectChanges();
  });

  it('isDarkTheme reflects layoutService.darkTheme', () => {
    layoutService.layoutConfig.update(s => ({ ...s, darkTheme: true }));
    expect(component.isDarkTheme()).toBeTrue();
  });

  it('toggleDarkMode toggles darkTheme', () => {
    const before = layoutService.layoutConfig().darkTheme;
    component.toggleDarkMode();
    expect(layoutService.layoutConfig().darkTheme).toBe(!before);
  });
});
