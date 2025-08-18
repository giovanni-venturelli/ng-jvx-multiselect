import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngJvxSelectionTemplate]'
})
export class NgJvxSelectionTemplateDirective {

  constructor(
    public template: TemplateRef<any>,
    private vcRef: ViewContainerRef) {
  }

  @Input() set ngJvxSelectionTemplateOf(source: Array<any[]>) {
    for (const item of source) {
      this.vcRef.createEmbeddedView(this.template, {$implicit: item});
    }
  }

}
