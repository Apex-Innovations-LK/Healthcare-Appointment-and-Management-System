import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSessionComponent } from './calendar-session.component';

describe('CalendarSessionComponent', () => {
  let component: CalendarSessionComponent;
  let fixture: ComponentFixture<CalendarSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
