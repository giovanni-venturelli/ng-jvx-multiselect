import {Component, viewChild} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {NgJvxSelectionTemplateDirective} from './ng-jvx-selection-template.directive';

@Component({
  imports: [NgJvxSelectionTemplateDirective],
  template: `<span class="row" *ngJvxSelectionTemplate="let item">{{ item.name }}</span>`
})
class HostComponent {
  directive = viewChild.required(NgJvxSelectionTemplateDirective);
}

describe('NgJvxSelectionTemplateDirective', () => {
  it('exposes the template without rendering it', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.directive().template).toBeDefined();
    expect(fixture.nativeElement.querySelector('.row')).toBeNull();
  });

  it('renders the selected option passed as $implicit when the template is instantiated', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const view = fixture.componentInstance.directive().template.createEmbeddedView({$implicit: {name: 'first'}});
    view.detectChanges();

    expect(view.rootNodes[0].textContent).toBe('first');
  });
});
