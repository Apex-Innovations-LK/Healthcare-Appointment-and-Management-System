import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMetricsChartComponent } from './patient-metrics-chart.component';

describe('PatientMetricsChartComponent', () => {
  let component: PatientMetricsChartComponent;
  let fixture: ComponentFixture<PatientMetricsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientMetricsChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientMetricsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
