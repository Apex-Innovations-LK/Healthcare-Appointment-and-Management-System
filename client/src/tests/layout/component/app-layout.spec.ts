import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppLayout } from '../../../app/layout/component/app.layout';
import { LayoutService } from '../../../app/layout/service/layout.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


describe('AppLayout', () => {
  let fixture: ComponentFixture<AppLayout>;
  let component: AppLayout;
  let layoutService: LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppLayout,
        RouterTestingModule ,
        NoopAnimationsModule
      ],
      providers: [LayoutService],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(AppLayout);
    component = fixture.componentInstance;
    layoutService = TestBed.inject(LayoutService);
    fixture.detectChanges();
  });

  it('hideMenu resets layoutState', () => {
    spyOn(layoutService.layoutState, 'update').and.callThrough();
    component.hideMenu();
    expect(layoutService.layoutState.update).toHaveBeenCalled();
  });

  it('blockBodyScroll adds blocked-scroll class', () => {
    document.body.classList.remove('blocked-scroll');
    component.blockBodyScroll();
    expect(document.body.classList.contains('blocked-scroll')).toBeTrue();
  });

  it('unblockBodyScroll removes blocked-scroll class', () => {
    document.body.classList.add('blocked-scroll');
    component.unblockBodyScroll();
    expect(document.body.classList.contains('blocked-scroll')).toBeFalse();
  });

  it('containerClass matches menuMode overlay', () => {
    layoutService.layoutConfig.update(s => ({ ...s, menuMode: 'overlay' }));
    expect(component.containerClass['layout-overlay']).toBeTrue();
  });
});
