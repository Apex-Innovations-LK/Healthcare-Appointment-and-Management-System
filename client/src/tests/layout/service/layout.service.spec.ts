import { TestBed } from '@angular/core/testing';
import { LayoutService } from '../../../app/layout/service/layout.service';

describe('LayoutService', () => {
  let service: LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [LayoutService] });
    service = TestBed.inject(LayoutService);
  });

  it('should initialize with default config', () => {
    const cfg = service.layoutConfig();
    expect(cfg.preset).toBe('Aura');
    expect(cfg.menuMode).toBe('static');
  });

  it('isDarkTheme computed works', () => {
    service.layoutConfig.update(s => ({ ...s, darkTheme: true }));
    expect(service.isDarkTheme()).toBeTrue();
  });

  it('onMenuToggle toggles overlay and desktop/mobile states', () => {
    service.layoutConfig.update(s => ({ ...s, menuMode: 'overlay' }));
    service.onMenuToggle();
    expect(service.layoutState().overlayMenuActive).toBeTrue();
  });
});
