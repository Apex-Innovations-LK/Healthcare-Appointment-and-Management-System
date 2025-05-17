// tests/layout/component/app-sidebar.spec.ts
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppSidebar } from '../../../app/layout/component/app.sidebar';
import { AppMenu } from '../../../app/layout/component/app.menu';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


describe('AppSidebar', () => {
  let fixture: ComponentFixture<AppSidebar>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppSidebar, AppMenu, RouterTestingModule, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(AppSidebar);
    fixture.detectChanges();
  });

  it('should render <app-menu> inside the sidebar container', () => {
    const menu = fixture.nativeElement.querySelector('app-menu');
    expect(menu).toBeTruthy();
  });
});
