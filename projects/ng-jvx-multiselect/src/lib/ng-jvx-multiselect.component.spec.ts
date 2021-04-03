import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgJvxMultiselectComponent } from './ng-jvx-multiselect.component';

describe('NgJvxMultiselectComponent', () => {
  let component: NgJvxMultiselectComponent;
  let fixture: ComponentFixture<NgJvxMultiselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgJvxMultiselectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgJvxMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
