import {AfterViewChecked, Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngJvxOptionsTemplate]'
})
export class NgJvxOptionsTemplateDirective {

  constructor(
    public template: TemplateRef<any>,
    private vcRef: ViewContainerRef) {
  }

  @Input() set ngJvxOptionsTemplateOf(source: Array<any[]>) {
    for (const item of source) {
      this.vcRef.createEmbeddedView(this.template, {$implicit: item});
    }
  }
}
