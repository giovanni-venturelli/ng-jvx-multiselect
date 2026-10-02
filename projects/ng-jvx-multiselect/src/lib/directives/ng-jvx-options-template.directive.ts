import {Directive, inject, Input, TemplateRef} from '@angular/core';

/** Context of the `*ngJvxOptionsTemplate` template: `let option` is the option to render. */
export interface NgJvxOptionsTemplateContext<T = any> {
  $implicit: T;
}

/**
 * Defines how each option is rendered in the panel.
 *
 * ```html
 * <div *ngJvxOptionsTemplate="let option">{{ option.text }}</div>
 * ```
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngJvxOptionsTemplate]'
})
export class NgJvxOptionsTemplateDirective<T = any> {
  readonly template: TemplateRef<NgJvxOptionsTemplateContext<T>> = inject(TemplateRef);

  /** @deprecated Has no effect: options are rendered by the multiselect. */
  @Input() ngJvxOptionsTemplateOf: unknown;

  static ngTemplateContextGuard<T>(dir: NgJvxOptionsTemplateDirective<T>, ctx: unknown): ctx is NgJvxOptionsTemplateContext<T> {
    return true;
  }
}
