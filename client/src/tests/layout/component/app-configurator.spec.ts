import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppConfigurator } from '../../../app/layout/component/app.configurator';
import { LayoutService } from '../../../app/layout/service/layout.service';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

describe('AppConfigurator', () => {
  let fixture: ComponentFixture<AppConfigurator>;
  let component: AppConfigurator;
  let layoutService: LayoutService;
  const mockRouter = { url: '/home' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppConfigurator],
      providers: [
        LayoutService,
        { provide: Router, useValue: mockRouter },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    fixture = TestBed.createComponent(AppConfigurator);
    component = fixture.componentInstance;
    layoutService = TestBed.inject(LayoutService);
    fixture.detectChanges();
  });

  it('ngOnInit should call onPresetChange once', () => {
    spyOn(component, 'onPresetChange');
    component.ngOnInit();
    expect(component.onPresetChange).toHaveBeenCalledWith(layoutService.layoutConfig().preset);
  });

  it('getPresetExt is called when applying primary theme', () => {
    spyOn(component, 'getPresetExt').and.returnValue({} as any);
    expect(() => component.applyTheme('primary', {})).not.toThrow();
    expect(component.getPresetExt).toHaveBeenCalled();
  });

  it('updateColors for primary updates layoutConfig and calls applyTheme', () => {
    const ev = { stopPropagation: jasmine.createSpy() } as any;
    spyOn(component, 'applyTheme');
    component.updateColors(ev, 'primary', { name: 'foo' });
    expect(layoutService.layoutConfig().primary).toBe('foo');
    expect(component.applyTheme).toHaveBeenCalledWith('primary', { name: 'foo' });
    expect(ev.stopPropagation).toHaveBeenCalled();
  });

  it('onPresetChange updates layoutConfig (preset) without error', () => {
    expect(() => component.onPresetChange('Lara')).not.toThrow();
    expect(layoutService.layoutConfig().preset).toBe('Lara');
  });
});
