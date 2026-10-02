import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NgJvxMultisectChipComponent} from './ng-jvx-multiselect-chip.component';

describe('NgJvxMultisectChipComponent', () => {
  let fixture: ComponentFixture<NgJvxMultisectChipComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NgJvxMultisectChipComponent);
    fixture.componentRef.setInput('value', {value: 1});
    fixture.detectChanges();
  });

  it('emits removed with its value', () => {
    const removed: unknown[] = [];
    fixture.componentInstance.removed.subscribe(v => removed.push(v));
    (fixture.nativeElement.querySelector('.remove-button') as HTMLElement).click();
    expect(removed).toEqual([{value: 1}]);
  });

  it('hides the remove button while disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.remove-button')).toBeNull();
  });
});
