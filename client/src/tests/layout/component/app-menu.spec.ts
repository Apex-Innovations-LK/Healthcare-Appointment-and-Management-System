// tests/layout/component/app-menu.spec.ts
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppMenu } from '../../../app/layout/component/app.menu';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


describe('AppMenu', () => {
  let fixture: ComponentFixture<AppMenu>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppMenu, RouterTestingModule, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(AppMenu);
    fixture.detectChanges();
  });

  it('renders a UL with class layout-menu', () => {
    const ul = fixture.nativeElement.querySelector('ul.layout-menu');
    expect(ul).toBeTruthy();
  });
});
