import {Directive, ElementRef, HostListener, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngJvxOptionsTemplate]'
})
export class NgJvxOptionsTemplateDirective {

  constructor(
    private el: ElementRef,
    public template: TemplateRef<any>,
    private vcRef: ViewContainerRef) {
  }



  @Input() set ngJvxOptionsTemplateOf(source: Array<any[]>) {
    for (const item of source) {
      this.vcRef.createEmbeddedView(this.template, {$implicit: item});
    }
  }

}
