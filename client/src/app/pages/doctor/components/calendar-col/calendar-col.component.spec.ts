import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarColComponent } from './calendar-col.component';

describe('CalendarColComponent', () => {
  let component: CalendarColComponent;
  let fixture: ComponentFixture<CalendarColComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarColComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
