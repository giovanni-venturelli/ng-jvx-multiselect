import {afterNextRender, Directive, effect, ElementRef, inject, Injector, input} from '@angular/core';

/** Focuses the host element whenever the bound value becomes `true`. Internal. */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngJvxFocus]'
})
export class NgJvxFocusDirective {
  readonly ngJvxFocus = input(false);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  constructor() {
    effect(() => {
      if (this.ngJvxFocus()) {
        // After rendering: the host may live in an overlay that is attached in the same change detection.
        afterNextRender(() => this.el.nativeElement.focus({preventScroll: true}), {injector: this.injector});
      }
    });
  }
}
