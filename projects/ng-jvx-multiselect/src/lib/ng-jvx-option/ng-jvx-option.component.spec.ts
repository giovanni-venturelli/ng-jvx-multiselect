import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgJvxOptionComponent } from './ng-jvx-option.component';

describe('NgJvxOptionComponent', () => {
  let component: NgJvxOptionComponent;
  let fixture: ComponentFixture<NgJvxOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgJvxOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgJvxOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
