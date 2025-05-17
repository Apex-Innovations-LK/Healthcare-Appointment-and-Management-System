import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppFooter } from '../../../app/layout/component/app.footer';
import { By } from '@angular/platform-browser';

describe('AppFooter', () => {
  let fixture: ComponentFixture<AppFooter>;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AppFooter] });
    fixture = TestBed.createComponent(AppFooter);
    fixture.detectChanges();
  });

  it('renders PrimeNG link', () => {
    const anchor = fixture.debugElement.query(By.css('a'));
    expect(anchor.nativeElement.textContent).toContain('PrimeNG');
    expect(anchor.nativeElement.getAttribute('href')).toBe('https://primeng.org');
  });
});
