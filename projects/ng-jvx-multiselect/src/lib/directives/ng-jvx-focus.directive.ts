import {AfterContentInit, Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {timer} from 'rxjs';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngJvxFocus]'
})
export class NgJvxFocusDirective implements OnInit, OnChanges {
  @Input() ngJvxFocus: boolean;

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    if (this.ngJvxFocus) {
      this.el.nativeElement.focus();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('ngJvxFocus') && changes.ngJvxFocus.currentValue === true) {
      this.el.nativeElement.focus();
    }
  }
}
