import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppMenuitem } from '../../../app/layout/component/app.menuitem';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MenuItem } from 'primeng/api';

describe('AppMenuitem', () => {
  let fixture: ComponentFixture<AppMenuitem>;
  let component: AppMenuitem;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMenuitem,
        NoopAnimationsModule,
      ]
    });

    fixture = TestBed.createComponent(AppMenuitem);
    component = fixture.componentInstance;

    // set inputs BEFORE detectChanges so ngOnInit sees them
    component.item = {
      label: 'Test',
      routerLink: ['/test'],
      items: [{ label: 'child' }]
    } as MenuItem;
    component.index = 0;
    component.root = true;

    // spy on the component’s private LayoutService
    spyOn((component as any).layoutService, 'onMenuStateChange');

    fixture.detectChanges(); // runs ngOnInit and sets key = '0'
  });

  it('should have key "0" after ngOnInit', () => {
    expect(component.key).toBe('0');
  });

  it('itemClick toggles active and calls onMenuStateChange', () => {
    component.active = false;
    component.itemClick(new MouseEvent('click'));

    expect(component.active).toBeTrue();
    expect((component as any).layoutService.onMenuStateChange)
      .toHaveBeenCalledWith({ key: '0' });
  });
});
