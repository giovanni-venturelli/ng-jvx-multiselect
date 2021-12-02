import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngJvxGroupHeader]'
})
export class NgJvxGroupHeaderDirective {

  constructor(
    public template: TemplateRef<any>,
    private vcRef: ViewContainerRef) {
  }

  @Input() set ngJvxGroupHeaderOf(source: Array<any[]>) {
    for (const item of source) {
      this.vcRef.createEmbeddedView(this.template, {$implicit: item});
    }
  }


}
