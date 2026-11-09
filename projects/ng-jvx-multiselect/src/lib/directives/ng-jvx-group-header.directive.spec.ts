import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgJvxGroupHeaderDirective } from './ng-jvx-group-header.directive';

@Component({
  imports: [NgJvxGroupHeaderDirective],
  template: `<span class="header" *ngJvxGroupHeader="let g">{{ g.group }} ({{ g.options.length }})</span>`
})
class HostComponent {
  directive = viewChild.required(NgJvxGroupHeaderDirective);
}

describe('NgJvxGroupHeaderDirective', () => {
  it('should create an instance', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.directive()).toBeInstanceOf(NgJvxGroupHeaderDirective);
  });

  it('exposes the template, which is not rendered by the directive itself', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.directive().template).toBeDefined();
    expect(fixture.nativeElement.querySelector('.header')).toBeNull();
  });

  it('renders the group passed as $implicit when the template is instantiated', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const view = fixture.componentInstance.directive().template.createEmbeddedView({
      $implicit: { group: 'a', options: [{}, {}] }
    });
    view.detectChanges();

    expect(view.rootNodes[0].textContent).toBe('a (2)');
  });
});
