import {Component, viewChild} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {NgJvxOptionsTemplateDirective} from './ng-jvx-options-template.directive';

@Component({
  imports: [NgJvxOptionsTemplateDirective],
  template: `<span class="row" *ngJvxOptionsTemplate="let item">{{ item.name }}</span>`
})
class HostComponent {
  directive = viewChild.required(NgJvxOptionsTemplateDirective);
}

describe('NgJvxOptionsTemplateDirective', () => {
  it('exposes the template without rendering it', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.directive().template).toBeDefined();
    expect(fixture.nativeElement.querySelector('.row')).toBeNull();
  });

  it('renders the option passed as $implicit when the template is instantiated', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const view = fixture.componentInstance.directive().template.createEmbeddedView({$implicit: {name: 'first'}});
    view.detectChanges();

    expect(view.rootNodes[0].textContent).toBe('first');
  });
});
