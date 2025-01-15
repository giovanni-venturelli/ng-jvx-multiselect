import {Directive, ElementRef, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {fromEvent, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[ngJvxDisabledOption]',
    standalone: false
})
export class NgJvxDisabledOptionDirective implements OnInit, OnDestroy {
  private isDisabled = false;
  private originalOpacity = 1;

  private unsubs = new Subject<void>();
  private restore = new Subject<void>();

  @Input() set ngJvxDisabledOption(source: boolean) {
    this.isDisabled = source;
    if (this.isDisabled) {
      this.el.nativeElement.style.opacity = this.originalOpacity ? this.originalOpacity / 2 : 0.5;
      fromEvent(this.el.nativeElement, 'click').pipe(takeUntil(this.restore), takeUntil(this.unsubs)).subscribe((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
      });
    } else {
      this.el.nativeElement.style.opacity = this.originalOpacity;
      this.restore.next();
    }
  }

  constructor(
    private el: ElementRef) {
    this.originalOpacity = el.nativeElement.style.opacity;

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubs.next();
    this.unsubs.complete();
  }
}
