import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrMsgModuleComponent } from './err-msg-module.component';

describe('ErrMsgModuleComponent', () => {
  let component: ErrMsgModuleComponent;
  let fixture: ComponentFixture<ErrMsgModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrMsgModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrMsgModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
