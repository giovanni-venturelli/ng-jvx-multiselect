import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgJvxPanelComponent } from './ng-jvx-panel.component';

describe('NgJvxPanelComponent', () => {
  let component: NgJvxPanelComponent;
  let fixture: ComponentFixture<NgJvxPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgJvxPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgJvxPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
