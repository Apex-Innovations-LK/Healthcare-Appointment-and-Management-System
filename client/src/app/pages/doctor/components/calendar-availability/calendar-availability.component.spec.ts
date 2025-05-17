import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarAvailabilityComponent } from './calendar-availability.component';

describe('CalendarAvailabilityComponent', () => {
  let component: CalendarAvailabilityComponent;
  let fixture: ComponentFixture<CalendarAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarAvailabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
