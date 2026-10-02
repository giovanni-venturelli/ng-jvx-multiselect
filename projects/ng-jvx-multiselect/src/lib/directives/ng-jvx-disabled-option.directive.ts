import {booleanAttribute, Directive, input} from '@angular/core';

/**
 * Makes the host option unselectable: clicks are swallowed and the option is dimmed.
 *
 * ```html
 * <div *ngJvxOptionsTemplate="let option" [ngJvxDisabledOption]="!option.active">...</div>
 * ```
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngJvxDisabledOption]',
  host: {
    '[class.ng-jvx-disabled-option]': 'ngJvxDisabledOption()',
    '[attr.aria-disabled]': 'ngJvxDisabledOption() || null',
    '(click)': 'onClick($event)'
  }
})
export class NgJvxDisabledOptionDirective {
  readonly ngJvxDisabledOption = input(false, {transform: booleanAttribute});

  protected onClick(event: MouseEvent): void {
    if (this.ngJvxDisabledOption()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
