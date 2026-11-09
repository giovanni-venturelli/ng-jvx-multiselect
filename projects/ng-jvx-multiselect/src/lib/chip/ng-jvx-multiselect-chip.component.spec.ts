import {Component, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NgJvxMultisectChipComponent} from './ng-jvx-multiselect-chip.component';
import {NG_JVX_MULTISELECT_CONTAINER} from '../core/container';

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

  it('works without a parent multiselect', () => {
    expect(fixture.componentInstance.container).toBeNull();
  });
});

@Component({
  imports: [NgJvxMultisectChipComponent],
  template: `<ng-jvx-multiselect-chip [value]="value">chip label</ng-jvx-multiselect-chip>`
})
class ChipHostComponent {
  value = {value: 1, text: 'chip label'};
}

describe('NgJvxMultisectChipComponent inside a multiselect', () => {
  const disabled = signal(false);
  const container = {disabledState: disabled, deselect: jasmine.createSpy('deselect')};

  const setup = () => {
    const host = TestBed.createComponent(ChipHostComponent);
    host.detectChanges();
    return host;
  };
  const clickRemove = (root: HTMLElement) =>
    root.querySelector<HTMLElement>('.remove-button')!.dispatchEvent(new MouseEvent('click', {bubbles: true}));

  beforeEach(() => {
    disabled.set(false);
    container.deselect.calls.reset();
    TestBed.configureTestingModule({
      imports: [ChipHostComponent],
      providers: [{provide: NG_JVX_MULTISELECT_CONTAINER, useValue: container}]
    });
  });

  it('shows the projected text', () => {
    expect(setup().nativeElement.querySelector('.chip-text').textContent.trim()).toBe('chip label');
  });

  it('removes the value from the parent when the remove button is clicked', () => {
    const host = setup();

    clickRemove(host.nativeElement);

    expect(container.deselect).toHaveBeenCalledOnceWith(host.componentInstance.value);
  });

  it('does not show the remove button when the parent is disabled', () => {
    disabled.set(true);
    const host = setup();

    expect(host.nativeElement.querySelector('.remove-button')).toBeNull();
    expect(container.deselect).not.toHaveBeenCalled();
  });
});
