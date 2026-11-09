import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgJvxDisabledOptionDirective } from './ng-jvx-disabled-option.directive';

@Component({
  imports: [NgJvxDisabledOptionDirective],
  template: `
    <div class="parent" (click)="parentClicks = parentClicks + 1">
      <div class="target" [ngJvxDisabledOption]="disabled()">option</div>
    </div>`
})
class HostComponent {
  disabled = signal(true);
  parentClicks = 0;
}

describe('NgJvxDisabledOptionDirective', () => {
  const setup = () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const target: HTMLElement = fixture.nativeElement.querySelector('.target');
    return { fixture, target };
  };

  it('should create an instance on a host element', () => {
    const { fixture } = setup();

    expect(fixture.nativeElement.querySelector('.target')).not.toBeNull();
  });

  it('marks the host as disabled and stops the click from reaching the parent when disabled', () => {
    const { fixture, target } = setup();

    target.click();

    expect(target.classList).toContain('ng-jvx-disabled-option');
    expect(target.getAttribute('aria-disabled')).toBe('true');
    expect(fixture.componentInstance.parentClicks).toBe(0);
  });

  it('removes the disabled marks and lets the click through when re-enabled', () => {
    const { fixture, target } = setup();

    fixture.componentInstance.disabled.set(false);
    fixture.detectChanges();
    target.click();

    expect(target.classList).not.toContain('ng-jvx-disabled-option');
    expect(target.hasAttribute('aria-disabled')).toBeFalse();
    expect(fixture.componentInstance.parentClicks).toBe(1);
  });
});
