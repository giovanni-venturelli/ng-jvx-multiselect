import {DestroyRef, Directive, ElementRef, inject, input, NgZone, output} from '@angular/core';

/**
 * Emits `ngJvxScrollEnd` when the host element is scrolled to its bottom. Internal.
 *
 * The scroll listener runs outside Angular: the zone is entered only when the bottom is reached.
 * It emits once per arrival, and again when the content has grown (e.g. a new page was appended).
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngJvxScrollEnd]'
})
export class NgJvxScrollEndDirective {
  /** Distance from the bottom, in px, at which the bottom is considered reached. */
  readonly scrollEndOffset = input(10);
  readonly ngJvxScrollEnd = output<void>();

  private atBottom = false;
  private emittedAtHeight = -1;

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const zone = inject(NgZone);
    const onScroll = () => {
      const atBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - this.scrollEndOffset();
      if (atBottom && (!this.atBottom || element.scrollHeight !== this.emittedAtHeight)) {
        this.emittedAtHeight = element.scrollHeight;
        zone.run(() => this.ngJvxScrollEnd.emit());
      }
      this.atBottom = atBottom;
    };
    zone.runOutsideAngular(() => element.addEventListener('scroll', onScroll, {passive: true}));
    inject(DestroyRef).onDestroy(() => element.removeEventListener('scroll', onScroll));
  }
}
