import {Directive, inject, Input, TemplateRef} from '@angular/core';
import {NgJvxOptionGroup} from '../core/models';

/** Context of the `*ngJvxGroupHeader` template: `let group` is `{group, options}`. */
export interface NgJvxGroupHeaderContext<T = any> {
  $implicit: NgJvxOptionGroup<T>;
}

/**
 * Defines how the header of each group is rendered when `groupBy` is set.
 *
 * ```html
 * <div *ngJvxGroupHeader="let g">{{ g.group }} ({{ g.options.length }})</div>
 * ```
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngJvxGroupHeader]'
})
export class NgJvxGroupHeaderDirective<T = any> {
  readonly template: TemplateRef<NgJvxGroupHeaderContext<T>> = inject(TemplateRef);

  /** @deprecated Has no effect: group headers are rendered by the multiselect. */
  @Input() ngJvxGroupHeaderOf: unknown;

  static ngTemplateContextGuard<T>(dir: NgJvxGroupHeaderDirective<T>, ctx: unknown): ctx is NgJvxGroupHeaderContext<T> {
    return true;
  }
}
