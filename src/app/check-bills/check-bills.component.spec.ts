import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckBillsComponent } from './check-bills.component';

describe('CheckBillsComponent', () => {
  let component: CheckBillsComponent;
  let fixture: ComponentFixture<CheckBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckBillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
