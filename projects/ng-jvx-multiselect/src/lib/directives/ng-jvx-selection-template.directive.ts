import {Directive, inject, Input, TemplateRef} from '@angular/core';

/**
 * Context of the `*ngJvxSelectionTemplate` template: `let value` is the array of the selected options in multiple
 * selection, the selected option in single selection.
 */
export interface NgJvxSelectionTemplateContext<T = any> {
  $implicit: T;
}

/**
 * Defines how the selected value is rendered.
 *
 * ```html
 * <ng-container *ngJvxSelectionTemplate="let value">...</ng-container>
 * ```
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngJvxSelectionTemplate]'
})
export class NgJvxSelectionTemplateDirective {
  readonly template: TemplateRef<NgJvxSelectionTemplateContext> = inject(TemplateRef);

  /** @deprecated Has no effect: the selection is rendered by the multiselect. */
  @Input() ngJvxSelectionTemplateOf: unknown;

  static ngTemplateContextGuard(dir: NgJvxSelectionTemplateDirective, ctx: unknown): ctx is NgJvxSelectionTemplateContext {
    return true;
  }
}
