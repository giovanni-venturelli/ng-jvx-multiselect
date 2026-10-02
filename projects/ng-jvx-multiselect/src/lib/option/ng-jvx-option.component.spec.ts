import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NgJvxOptionComponent} from './ng-jvx-option.component';

describe('NgJvxOptionComponent', () => {
  let fixture: ComponentFixture<NgJvxOptionComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NgJvxOptionComponent);
    fixture.componentRef.setInput('value', 7);
    fixture.detectChanges();
  });

  const inner = (): HTMLElement => fixture.nativeElement.querySelector('.ng-jvx-option');

  it('emits its value when clicked', () => {
    const clicked: unknown[] = [];
    fixture.componentInstance.clickOnOption.subscribe(v => clicked.push(v));
    inner().click();
    expect(clicked).toEqual([7]);
  });

  it('does not emit while disabled', () => {
    const clicked: unknown[] = [];
    fixture.componentInstance.clickOnOption.subscribe(v => clicked.push(v));
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    inner().click();
    expect(clicked).toEqual([]);
    expect(fixture.nativeElement.getAttribute('aria-disabled')).toBe('true');
  });

  it('reflects the selection state', () => {
    fixture.componentRef.setInput('isSelected', true);
    fixture.detectChanges();
    expect(inner().classList).toContain('ng-jvx-single-selected-option');
    expect(fixture.nativeElement.getAttribute('aria-selected')).toBe('true');
  });
});
